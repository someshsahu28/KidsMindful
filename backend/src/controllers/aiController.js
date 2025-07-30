import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiController = {
    generateStory: asyncHandler(async (req, res) => {
        const { prompt, ageGroup, storyLength, theme } = req.body;

        if (!prompt) {
            throw new ApiError(400, "Story prompt is required");
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const storyPrompt = `Create a child-friendly story based on the following prompt: "${prompt}"

Guidelines:
- Age group: ${ageGroup || 'children aged 5-12'}
- Story length: ${storyLength || 'medium (300-500 words)'}
- Theme: ${theme || 'adventure and friendship'}
- Make it educational and promote positive values
- Include a clear moral lesson
- Use simple, engaging language
- Make it interactive and imaginative
- Ensure content is completely safe and appropriate for children

Please create an engaging story that children will love to read and learn from.`;

            const result = await model.generateContent(storyPrompt);
            const response = await result.response;
            const story = response.text();

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        { story, prompt, ageGroup, theme },
                        "Story generated successfully"
                    )
                );
        } catch (error) {
            throw new ApiError(
                500,
                error.message || "Failed to generate story"
            );
        }
    }),

    reviewCode: asyncHandler(async (req, res) => {
        // ... existing code review function
    }),
};

export default aiController;