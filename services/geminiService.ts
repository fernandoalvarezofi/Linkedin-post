import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateCreativeTopic = async (): Promise<string> => {
    const prompt = `
        Actuás como un líder de opinión y educador de LinkedIn, especializado en la intersección de la IA, los negocios y la innovación.
        Tu misión es generar UNA ÚNICA idea para una publicación que sea estratégica, incite a la reflexión y ofrezca un valor inmenso a una audiencia profesional.

        Piensa más allá de los simples "prompts". Quiero que generes ideas que cubran diferentes formatos de contenido: análisis de tendencias, estudios de caso, tutoriales estratégicos, comparativas y consejos de alto nivel.

        El tema debe ser específico, intrigante y prometer un aprendizaje real.

        Aquí tienes ejemplos del tipo de ideas variadas que busco:
        - "Análisis de Tendencia: 3 nichos de mercado que la IA generativa creará en los próximos 2 años."
        - "Caso de Estudio: Cómo una startup de e-commerce redujo sus costos de soporte en un 40% con un chatbot de IA."
        - "Guía paso a paso para crear tu primer 'agente' de IA sin escribir una línea de código."
        - "Comparativa: Midjourney vs. Ideogram. ¿Qué generador de imágenes es mejor para crear logos profesionales?"
        - "El error estratégico #1 al implementar IA en tu flujo de trabajo (y cómo evitarlo)."
        - "Mito de la IA: ¿Realmente la IA 'robará' todos los trabajos creativos? Una perspectiva realista."
        - "Cómo auditar tu propio trabajo para encontrar tareas que una IA puede hacer por vos."
        - "Más allá de la automatización: Usando la IA para mejorar la toma de decisiones estratégicas."

        Asegurate de que la idea generada suene natural y esté redactada en un español rioplatense (argentino) atractivo.
        Ahora, generá una nueva idea de tema original y de alto valor. Solo devolvé el texto del tema, sin comillas ni texto introductorio.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const topic = response.text.trim().replace(/^"|"$/g, ''); // Clean up potential quotes
        if (!topic) {
            throw new Error("La API no devolvió un tema.");
        }
        return topic;
    } catch (error) {
        console.error("Error generating creative topic:", error);
        throw new Error("No se pudo generar una idea para la publicación.");
    }
}

export const generateLinkedInPost = async (topic: string): Promise<string> => {
    const prompt = `
        Actuás como un Consultor de IA y Productividad para profesionales, escribiendo en español rioplatense (Argentina). Tu audiencia son trabajadores, gerentes y emprendedores que buscan aplicar la IA en su trabajo diario para ser más eficientes.
        Tu tarea es escribir una publicación educativa, práctica y accionable sobre el siguiente tema.

        Tema: "${topic}"

        La publicación debe seguir esta estructura general:
        1.  **Gancho Atractivo:** Comienza con una pregunta o una afirmación audaz que capte la atención y presente el problema o la oportunidad.
        2.  **Desarrollo del Valor:** Explica el concepto, la estrategia o la herramienta. Si es un caso de estudio, describe los resultados. Si es un análisis, detalla las implicaciones. El objetivo es educar claramente.
        3.  **Aplicación Práctica / Pasos Accionables:** Ofrece los pasos concretos, ejemplos, o consejos que la audiencia pueda aplicar. Si el tema es más estratégico, esta sección puede ser una lista de "takeaways" o preguntas para la reflexión. Esta es la parte de mayor valor.
        4.  **Cierre:** Termina con una frase que motive a la acción o una pregunta que invite a la discusión.
        5.  **Hashtags:** Incluye 3-5 hashtags relevantes y enfocados en el ámbito profesional (ej: #InteligenciaArtificial #ProductividadLaboral #EstrategiaDigital #Innovacion #TransformacionDigital).

        REGLAS DE ESTILO:
        - Lenguaje: Español rioplatense (Argentina). Utilizá la forma 'vos' (voseo) para la segunda persona del singular (ej: 'aplicá', 'encontrá', 'imaginate').
        - Tono: Profesional, claro y cercano. Evitá un lenguaje excesivamente robótico o neutral. Imagina que le estás explicando esto a un colega con claridad y confianza.
        - Formato: Usa párrafos muy cortos y saltos de línea para máxima legibilidad en móviles.
        - Prohibido Markdown: No uses NUNCA asteriscos (*) ni ningún otro formato. Escribe en texto plano.

        IMPORTANTE FINAL: Devuelve ÚNICAMENTE el texto de la publicación, sin ninguna frase introductoria. El resultado debe ser directamente publicable.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        
        const post = response.text.trim();

        if (!post) {
            throw new Error("La API no devolvió contenido para la publicación.");
        }
        
        return post;
    } catch (error) {
        console.error("Error generating LinkedIn post:", error);
        throw new Error("No se pudo generar la publicación para LinkedIn.");
    }
};


export const generateImageForPost = async (postContent: string): Promise<string> => {
    try {
        // Step 1: Generate a creative, relevant prompt for Imagen based on the post content.
        const promptGeneratorResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a senior graphic designer for a top-tier business consulting firm. Your task is to create ONE image prompt in English for an AI image generator. This image will accompany a LinkedIn post. The goal is a professional, clean, and conceptually brilliant image that feels human-designed, not obviously AI-generated.

**Your Style Guide:**
-   **AVOID:** Futuristic, sci-fi, cyberpunk aesthetics, glowing neon, overly complex scenes. The image must not scream "AI-generated".
-   **APPROVED STYLES (Choose ONE per prompt):**
    1.  **Clean Vector Illustration:** Minimalist, two-tone or limited color palette on a solid background. Ideal for abstract concepts.
    2.  **Conceptual Photography:** A high-quality, bright, airy photo of real-world objects that form a metaphor (e.g., a single lit lightbulb among unlit ones for 'a new idea'). Focus on objects, not people. Flat lay compositions are excellent.
    3.  **Subtle 3D Icons:** Clean, "claymorphism" or "glassmorphism" style 3D icons representing a single concept on a simple, clean background.

**Your Creative Process:**
1.  **Distill the Core Message:** Read the post and summarize its single most important takeaway. What is the central idea or action?
2.  **Find a Universal Metaphor:** Brainstorm a simple, universally understood object or scene that represents this core message. (e.g., Growth -> A seedling; Strategy -> A chess piece; Connection -> A bridge; Focus -> A magnifying glass).
3.  **Select the Best Style:** Choose the most appropriate style from the approved list to represent your metaphor.
4.  **Write the Prompt:** Combine the metaphor and style into a detailed, specific prompt. Describe the composition, color palette, and lighting precisely.

**Post Content to Analyze:**
"${postContent}"

**Example of Your Thought Process:**
-   **Post Core Message:** "Using an AI tool to automate repetitive weekly reports saves time."
-   **Universal Metaphor:** A calendar or a series of dominoes tipping over to represent automation. Dominoes are more visually interesting.
-   **Best Style:** A clean vector illustration to keep it professional and conceptual.
-   **Your Generated Prompt:** "Clean vector illustration of a series of dominoes, starting with a large, complex one and transitioning into smaller, simpler ones, representing process automation. Professional color palette of navy blue and light gray, with one teal accent color on a solid light gray background."

Now, apply this process to the provided post content. Generate one single, final prompt.
`
        });
        const imagePrompt = promptGeneratorResponse.text.trim();

        if (!imagePrompt) {
            throw new Error("No se pudo generar un prompt para la imagen.");
        }
        
        // Step 2: Generate the image using Imagen
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1', // Square format is great for LinkedIn
            },
        });

        const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
        if (!base64ImageBytes) {
            throw new Error("La API no devolvió una imagen.");
        }

        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating image for post:", error);
        throw new Error("No se pudo generar una imagen para la publicación.");
    }
};