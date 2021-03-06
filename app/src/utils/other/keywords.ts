import ingTokens from "../../data/ingTokens.json" assert {type: "json"};
import highIngTokens from "../../data/highIngTokens.json" assert {type: "json"};
import lowIngTokens from "../../data/lowIngTokens.json" assert {type: "json"};
import toolTokens from "../../data/toolTokens.json" assert {type: "json"};
import directionKeywords from "../../data/customDirectionKeywords.json" assert {type: "json"};

export const highPriorityIngredientTokens: Set<string> = new Set(highIngTokens);
export const lowPriorityIngredientTokens: Set<string> = new Set(lowIngTokens);
export const commonIngredientTokens: Set<string> = new Set(ingTokens);
export const commonToolTokens: Set<string> = new Set(toolTokens);

export const stopwords: Set<string> = new Set(["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]);
export const commonDirectionKeywords: Set<string> = new Set(directionKeywords);