import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  sellerName: string;
  description: string;
}

// Helper to provide a comprehensive local inventory answer if no external API key is provided
function answerWithLocalStockEngine(query: string, inventory: ProductItem[]): string {
  const q = query.toLowerCase().trim();

  // Check if asking about low stock / acabando
  if (q.includes('acabando') || q.includes('baixo') || q.includes('pouco estoque') || q.includes('esgotado') || q.includes('falta')) {
    const lowStock = inventory.filter(p => p.stock <= 5);
    if (lowStock.length === 0) {
      return `Todos os nossos produtos estão com bom estoque no momento! Nenhum item com menos de 5 unidades.`;
    }
    const list = lowStock
      .map(p => `• **${p.name}** (${p.category}): ${p.stock === 0 ? '⚠️ Esgotado (0 ' + p.unit + ')' : 'Restam apenas ' + p.stock + ' ' + p.unit} - R$ ${p.price.toFixed(2).replace('.', ',')}`)
      .join('\n');
    return `Identifiquei os seguintes produtos com estoque reduzido ou esgotados:\n\n${list}\n\nRecomendo garantir o seu pedido antes que esgote!`;
  }

  // Check if asking about cheapest products / mais barato
  if (q.includes('mais barato') || q.includes('menor preco') || q.includes('menor preço') || q.includes('economico') || q.includes('econômico')) {
    const sorted = [...inventory].sort((a, b) => a.price - b.price);
    const top3 = sorted.slice(0, 4);
    const list = top3
      .map(p => `• **${p.name}** - R$ ${p.price.toFixed(2).replace('.', ',')} / ${p.unit} (Estoque: ${p.stock} un | Categoria: ${p.category})`)
      .join('\n');
    return `Os produtos com menor preço no mercado hoje são:\n\n${list}\n\nVocê pode adicioná-los diretamente ao carrinho pela vitrine!`;
  }

  // Check if asking about a category
  const categories = Array.from(new Set(inventory.map(p => p.category)));
  const matchedCategory = categories.find(c => q.includes(c.toLowerCase()));
  if (matchedCategory) {
    const items = inventory.filter(p => p.category.toLowerCase() === matchedCategory.toLowerCase());
    const list = items
      .map(p => `• **${p.name}**: R$ ${p.price.toFixed(2).replace('.', ',')} (${p.stock} ${p.unit} em estoque) - Loja: ${p.sellerName}`)
      .join('\n');
    return `Na categoria **${matchedCategory}**, temos **${items.length} itens** disponíveis:\n\n${list}\n\nDeseja saber detalhes sobre algum desses produtos?`;
  }

  // Check if asking about a specific product name
  const matchedProducts = inventory.filter(p => 
    q.includes(p.name.toLowerCase()) || 
    p.name.toLowerCase().split(' ').some(word => word.length > 3 && q.includes(word))
  );

  if (matchedProducts.length > 0) {
    const details = matchedProducts.map(p => {
      const stockStatus = p.stock === 0 
        ? '⚠️ Esgotado' 
        : p.stock <= 5 
          ? `⚠️ Apenas ${p.stock} ${p.unit} restantes (Estoque Baixo)` 
          : `✅ ${p.stock} ${p.unit} disponíveis`;

      return `📦 **${p.name}**\n- **Categoria**: ${p.category}\n- **Preço**: R$ ${p.price.toFixed(2).replace('.', ',')} por ${p.unit}\n- **Disponibilidade**: ${stockStatus}\n- **Vendedor**: ${p.sellerName}\n- **Descrição**: ${p.description}`;
    }).join('\n\n');

    return `Encontrei no catálogo:\n\n${details}\n\nPosso te ajudar a encontrar mais algum item complementar?`;
  }

  // Check if asking about a seller
  const sellers = Array.from(new Set(inventory.map(p => p.sellerName)));
  const matchedSeller = sellers.find(s => q.includes(s.toLowerCase()));
  if (matchedSeller) {
    const sellerItems = inventory.filter(p => p.sellerName.toLowerCase() === matchedSeller.toLowerCase());
    const list = sellerItems.map(p => `• **${p.name}** (${p.category}): R$ ${p.price.toFixed(2).replace('.', ',')} (${p.stock} ${p.unit})`).join('\n');
    return `O vendedor **${matchedSeller}** tem ${sellerItems.length} produtos cadastrados:\n\n${list}`;
  }

  // General stock overview
  const totalStock = inventory.reduce((acc, curr) => acc + curr.stock, 0);
  const outOfStockCount = inventory.filter(p => p.stock === 0).length;

  return `Olá! Sou o Assistente de Estoque do MercadoConecta. 🥦🥖\n\nNo momento, temos **${inventory.length} produtos cadastrados** com um total de **${totalStock} itens** no estoque geral espalhados em categorias como ${categories.slice(0, 4).join(', ')}.\n${outOfStockCount > 0 ? `Temos ${outOfStockCount} item(ns) esgotado(s).` : 'Todos os itens possuem estoque ativo.'}\n\nVocê pode me perguntar coisas como:\n- "Tem maçã ou pão disponível?"\n- "Quais produtos estão com estoque baixo?"\n- "O que tem na categoria Hortifrúti?"\n- "Qual o produto mais barato?"`;
}

// API Health / Config status
app.get('/api/status', (_req: Request, res: Response) => {
  const hasGroq = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'MY_GROQ_API_KEY');
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

  res.json({
    status: 'ok',
    groqConfigured: hasGroq,
    geminiConfigured: hasGemini,
    engine: hasGroq ? 'Groq' : (hasGemini ? 'Gemini 3.8 Flash' : 'Motor Especialista de Estoque')
  });
});

// Chatbot consultation endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages = [], inventory = [] } = req.body;
    const latestUserMessage = messages[messages.length - 1]?.content || '';

    const groqKey = process.env.GROQ_API_KEY;
    const isGroqValid = groqKey && groqKey !== 'MY_GROQ_API_KEY';

    const systemPrompt = `Você é o Assistente Especialista de Estoque do MercadoConecta, um marketplace em português onde compradores adquirem itens e vendedores cadastram produtos organizados por categorias.
Seu papel é responder dúvidas de forma rápida, simpática, prestativa e totalmente precisa baseando-se estritamente no estoque atual fornecido.

ESTOQUE ATUAL DO MERCADO EM TEMPO REAL:
${JSON.stringify(inventory, null, 2)}

DIRETRIZES DE RESPOSTA:
1. Responda sempre em português do Brasil com formatação elegante em Markdown (use negrito para nomes de produtos e preços, listas com tópicos).
2. Se o usuário perguntar a quantidade de algum item, mencione o estoque exato e a unidade (ex: "temos 15 kg disponíveis").
3. Se um produto estiver esgotado (estoque 0), informe de maneira transparente com um aviso.
4. Se o usuário pedir recomendações ou comparar preços, use os dados reais do estoque.
5. Se o produto procurado não constar no estoque, informe gentilmente que o item não está disponível no mercado no momento e sugira categorias ou itens relacionados.
6. Mantenha as respostas concisas e diretas ao ponto.`;

    // 1. Try Groq API first if configured
    if (isGroqValid) {
      // Modern 2026 Groq production chat models
      const standardPreferredModels = [
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'qwen/qwen3.8-27b',
        'minimaxai/minimax-m2.7'
      ];
      let groqCandidateModels = [...standardPreferredModels];

      // Dynamically query available models from Groq for this API key
      try {
        const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { 'Authorization': `Bearer ${groqKey}` }
        });
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          const activeModels: string[] = (modelsData.data || [])
            .map((m: any) => m.id as string)
            .filter((id: string) => {
              // Exclude TTS, audio, whisper, safeguard, embeddings, or special dialect models
              const isExcluded = ['whisper', 'embed', 'guard', 'orpheus', 'audio', 'tts', 'play', 'canopy'].some(term => id.toLowerCase().includes(term));
              if (isExcluded) return false;
              // Keep recognized text models
              return ['openai/gpt-oss', 'qwen', 'minimax', 'llama'].some(term => id.toLowerCase().includes(term));
            });
          
          if (activeModels.length > 0) {
            // Prioritize discovered active chat models
            groqCandidateModels = [...new Set([...activeModels, ...standardPreferredModels])];
          }
        }
      } catch (listErr) {
        console.info('Could not fetch Groq model list, using standard defaults:', listErr);
      }

      for (const model of groqCandidateModels) {
        try {
          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: { role: string; content: string }) => ({
                  role: m.role === 'assistant' ? 'assistant' : 'user',
                  content: m.content
                }))
              ],
              temperature: 0.2,
              max_tokens: 1024
            })
          });

          if (groqResponse.ok) {
            const data = await groqResponse.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              return res.json({
                reply,
                source: `Groq (${model})`,
                success: true
              });
            }
          } else {
            console.info(`Groq model ${model} returned status ${groqResponse.status}, trying next model...`);
          }
        } catch (groqErr) {
          console.info(`Groq API attempt failed for ${model}, trying next...`);
        }
      }
    }

    // 2. Try Gemini API if Gemini key is available
    const geminiKey = process.env.GEMINI_API_KEY;
    const isGeminiValid = geminiKey && geminiKey !== 'MY_GEMINI_API_KEY';
    if (isGeminiValid) {
      try {
        const ai = new GoogleGenAI();
        const geminiMessages = messages.map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Cliente' : 'Assistente'}: ${m.content}`).join('\n\n');
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nHISTÓRICO DA CONVERSA:\n${geminiMessages}\n\nCliente: ${latestUserMessage}\nAssistente:`
        });

        if (response.text) {
          return res.json({
            reply: response.text,
            source: 'Gemini 3.8 Flash',
            success: true
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back:', geminiErr);
      }
    }

    // 3. Guaranteed Local Stock Engine fallback
    const localReply = answerWithLocalStockEngine(latestUserMessage, inventory);
    return res.json({
      reply: localReply,
      source: isGroqValid ? 'Motor Especialista (Groq indisponível)' : 'Motor de Estoque em Tempo Real',
      success: true
    });

  } catch (error) {
    console.error('Server error handling chat:', error);
    res.status(500).json({
      error: 'Erro interno ao consultar o estoque',
      reply: 'Desculpe, ocorreu uma instabilidade momentânea ao consultar o estoque. Por favor, tente novamente.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`MercadoConecta server running on http://localhost:${port}`);
  });
}

startServer();
