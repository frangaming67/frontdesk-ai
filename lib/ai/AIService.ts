import type { ConversationState, AIReply } from "./types";

/**
 * Abstraction the chat UI talks to. Today this is implemented by
 * DemoAIService (a controlled, scripted flow that needs no external API
 * key). Later it can be implemented by a RealAIService backed by an LLM
 * without the chat component changing at all.
 */
export interface AIService {
  initialState(): ConversationState;
  greeting(): string;
  respond(state: ConversationState, userMessage: string): AIReply;
}
