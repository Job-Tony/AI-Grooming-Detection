import api from "../api/api";
import type { Conversation } from "../types/Conversation";
import type { PredictionWithExplanation } from "../types/prediction";

export class AIService {
  static async analyzeConversation(
    conversation: Conversation,
  ): Promise<PredictionWithExplanation> {
    const response = await api.post(
      "/ai/predict/explain",
      {
        conversation: conversation.messages.map(
          (message) => message.content,
        ),
      },
    );

    return response.data;
  }
}

export default AIService;