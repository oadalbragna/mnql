import { GoogleGenAI, Chat, Type, Modality, GenerateContentResponse } from "@google/genai";
// Fixed error: Removed non-existent member 'MarketReport' from types import
import { Product, AgriDiagnosis, CategoryId } from "../types";

/**
 * Always initialize GoogleGenAI with a named apiKey parameter strictly from process.env.API_KEY.
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export function encodeAudio(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeAudio(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const estimateDeliveryTime = async (from: string, to: string): Promise<{time: string, cost: number}> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `أنت خبير لوجستي في مدينة المناقل بالسودان. احسب الوقت المتوقع للتوصيل بالدقائق والتكلفة التقريبية بالجنيه السوداني لرحلة من "${from}" إلى "${to}". المناقل مدينة متوسطة الحجم والشوارع قد تكون مزدحمة في السوق الكبير. أجب بتنسيق JSON فقط: {"time": "25 دقيقة", "cost": 2500}`,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || '{"time": "30 دقيقة", "cost": 2000}');
    } catch (e) { 
        return { time: "غير محدد", cost: 0 }; 
    }
};

export const compareProductsWithAI = async (p1: Product, p2: Product): Promise<string> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `قارن بين هذين المنتجين in سوق المناقل بالسودان:\n1. ${p1.title}: ${p1.description} (السعر: ${p1.price})\n2. ${p2.title}: ${p2.description} (السعر: ${p2.price})\nأعطني نصيحة بلهجة سودانية ودودة أيهما أفضل ولماذا؟`,
        });
        return response.text || "لا يمكن المقارنة حالياً.";
    } catch (e) { return "فشل تحليل المقارنة."; }
};

export const getMarketTrends = async (): Promise<{text: string, sources: { title: string; uri: string }[]}> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "ما هي أحدث اتجاهات أسعار المحاصيل (فول، سمسم، صمغ عربي) وأسعار الصرف في السودان اليوم؟ قدم نصيحة للمزارعين والتجار.",
            config: { tools: [{googleSearch: {}}] }
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .map((c: any) => c.web ? { title: String(c.web.title), uri: String(c.web.uri) } : null)
            .filter((s): s is { title: string; uri: string } => s !== null);

        return { text: response.text || "", sources };
    } catch (e) { return { text: "تعذر الاتصال بالبورصة.", sources: [] }; }
};

export const getAgriDeepDive = async (): Promise<{text: string, sources: { title: string; uri: string }[]}> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: "حلل تأثير حالة الطقس الحالية في ولاية الجزيرة بالسودان وتأثير أسعار السمسم والفول العالمية على مزارعي المناقل هذا الأسبوع. قدم توصيات عملية.",
            config: { tools: [{googleSearch: {}}] }
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .map((c: any) => c.web ? { title: String(c.web.title), uri: String(c.web.uri) } : null)
            .filter((s): s is { title: string; uri: string } => s !== null);

        return { text: response.text || "", sources };
    } catch (e) { return { text: "تعذر إجراء التحليل العميق.", sources: [] }; }
};

export const getCommunityNews = async (): Promise<{text: string, sources: { title: string; uri: string }[]}> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "ما هي أهم الأخبار المحلية والفعاليات والخدمات الجديدة في مدينة المناقل وولاية الجزيرة بالسودان خلال الـ 24 ساعة الماضية؟",
            config: { tools: [{googleSearch: {}}] }
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .map((c: any) => c.web ? { title: String(c.web.title), uri: String(c.web.uri) } : null)
            .filter((s): s is { title: string; uri: string } => s !== null);

        return { text: response.text || "", sources };
    } catch (e) { return { text: "تعذر جلب الأخبار المحلية.", sources: [] }; }
};

export const generateSmartDescription = async (title: string, keywords: string): Promise<string> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `اكتب وصفاً جذاباً ومحترفاً باللغة العربية لإعلان بيع منتج عنوانه "${title}" مع التركيز على هذه الكلمات المفتاحية: ${keywords}. اجعل الوصف قصيراً ومناسباً لسوق السودان.`,
        });
        return response.text || "وصف المنتج غير متوفر.";
    } catch (e) { return "وصف المنتج غير متوفر."; }
};

export const suggestMarketPrice = async (title: string, category: CategoryId): Promise<string> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `ما هو السعر المتوقع بالجنيه السوداني لمنتج عنوانه "${title}" في قسم "${category}" في سوق المناقل بالسودان؟ أعطني رقماً تقريبياً فقط.`,
        });
        return response.text || "غير متوفر";
    } catch (e) { return "تعذر الحصول على اقتراح سعر."; }
};

export const generateProductImage = async (title: string, category: CategoryId): Promise<string | null> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `A professional product photo of ${title} for a marketplace.` }] },
            config: { imageConfig: { aspectRatio: "1:1" } }
        });
        const candidate = response.candidates?.[0];
        const part = candidate?.content?.parts?.find(p => p.inlineData);
        return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
};

export const generateProductVideo = async (title: string, description: string): Promise<string | null> => {
    try {
        const ai = getAI();
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `Commercial for ${title}. ${description}`,
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
        });
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        return downloadLink ? `${downloadLink}&key=${process.env.API_KEY}` : null;
    } catch (e) { return null; }
};

export const createMarketChat = async (products: Product[]): Promise<Chat> => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { 
            systemInstruction: `أنت "سما"، المساعدة الذكية الرسمية لمنصة "سوق المناقل".
            مهمتك هي مساعدة سكان المناقل وتجارها في البيع والشراء ومعرفة الأسعار.
            تحدثي بلهجة سودانية ودودة ومحترمة (عامية بيضاء مفهومة).
            
            معلومات عنك:
            - اسمك: سما (Sama)
            - وظيفتك: مساعدة المستخدمين في العثور على المنتجات، معرفة أسعار المحاصيل، وحجز المواصلات.
            - العملة: الجنيه السوداني (ج.س).
            - المناطق: تغطين كافة أحياء المناقل والقرى المجاورة (شكابة، الكريدة، عبود، كريمة).
            
            المنتجات المتوفرة حالياً في الذاكرة: ${JSON.stringify(products.map(p => p.title))}
            ` 
        }
    });
};

export const connectToLiveAssistant = async (callbacks: any): Promise<any> => {
    const ai = getAI();
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            systemInstruction: `أنت "سما"، المساعدة الصوتية لمنصة سوق المناقل.
            تحدثي بلهجة سودانية خفيفة وودودة.
            ساعدي المستخدمين في:
            1. معرفة أسعار المحاصيل في بورصة المناقل اليوم.
            2. البحث عن سلع معينة في السوق.
            3. تقديم نصائح زراعية لمزارعي الجزيرة.
            كوني مختصرة ومفيدة.`,
        },
    });
};

// Fixed error: Updated return type to Pick<AgriDiagnosis, 'issue' | 'remedy' | 'urgency' | 'sources'>
// to match returned object properties and satisfy type constraints in AgriAI.tsx
export const diagnoseCropIssue = async (imageBase64: string): Promise<Pick<AgriDiagnosis, 'issue' | 'remedy' | 'urgency' | 'sources'>> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/jpeg' } }, { text: "شخص مشكلة المحصول في الصورة. قدم العلاج العضوي والكيميائي." }] },
            config: {
                tools: [{googleSearch: {}}],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        issue: { type: Type.STRING },
                        remedy: { type: Type.STRING },
                        urgency: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
                    },
                    required: ["issue", "remedy", "urgency"]
                }
            }
        });
        
        const result = JSON.parse(response.text || "{}");
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .map((c: any) => c.web ? { title: String(c.web.title), uri: String(c.web.uri) } : null)
            .filter((s): s is { title: string; uri: string } => s !== null);

        return {
            issue: result.issue || "غير محدد",
            remedy: result.remedy || "يرجى مراجعة خبير محلي",
            urgency: (result.urgency as 'low' | 'medium' | 'high') || 'low',
            sources: sources
        };
    } catch (e) { throw new Error("فشل التشخيص."); }
};

export const visualSearchProducts = async (imageBase64: string): Promise<string> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/jpeg' } }, { text: "ما هذا المنتج؟" }] }
        });
        return (response.text || "").trim();
    } catch (e) { return ""; }
};

export const fetchMarketNews = async (): Promise<{title: string, content: string, date: string, sources: { title: string; uri: string }[]}> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: "أسعار الصرف والمحاصيل في السودان اليوم.",
            config: { tools: [{googleSearch: {}}] }
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .map((c: any) => c.web ? { title: String(c.web.title), uri: String(c.web.uri) } : null)
            .filter((s): s is { title: string; uri: string } => s !== null);

        return { 
            title: "نشرة السوق", 
            content: response.text || "", 
            date: new Date().toLocaleDateString(),
            sources
        };
    } catch (e) { return { title: "خطأ", content: "فشل الجلب", date: "", sources: [] }; }
};

export const searchNearbyPlaces = async (query: string, lat: number, lng: number): Promise<{ text: string, chunks: any[] }> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `أبحث عن ${query} في المناقل.`,
            config: { 
                tools: [{googleMaps: {}}], 
                toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } } 
            }
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text || "", chunks };
    } catch (e) { return { text: "خطأ في البحث", chunks: [] }; }
};

export const searchMarketContext = async (query: string, lat?: number, lng?: number): Promise<{ text: string, sources: { title: string; uri: string; type: 'web' | 'maps' }[] }> => {
    try {
        const ai = getAI();
        const config: any = {
            tools: [{googleMaps: {}}, {googleSearch: {}}],
        };
        
        if (lat && lng) {
            config.toolConfig = { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } };
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `بصفتك مساعداً ذكياً في المناقل، السودان، أجب عن هذا الاستفسار: "${query}". ابحث عن أماكن حقيقية أو أخبار محلية بدقة. ركز على تقديم معلومات مفيدة ومحدثة.`,
            config
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks.map((c: any) => {
            if (c.maps) return { title: String(c.maps.title), uri: String(c.maps.uri), type: 'maps' as const };
            if (c.web) return { title: String(c.web.title), uri: String(c.web.uri), type: 'web' as const };
            return null;
        }).filter((s): s is { title: string; uri: string; type: 'web' | 'maps' } => s !== null);

        return { text: response.text || "", sources };
    } catch (e) { 
        return { text: "عفواً، تعذر الوصول للبيانات اللحظية حالياً.", sources: [] }; 
    }
};