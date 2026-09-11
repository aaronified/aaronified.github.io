// Ask-me chat — a client-side Q&A widget over the résumé content in the other data/*.js files.
//
// There is NO network call, NO API key and NO language model behind this. It builds a small
// search index over the site's own content, matches the visitor's question against it, and
// answers by QUOTING the matching entry and linking to the section it came from. When nothing
// matches well enough it says so and offers suggestions — it never invents an answer.
//
// Everything below is data: index.html reads this file through defensive accessors, so the
// widget can be retuned (or switched off) without touching the rendering logic.
const CHAT_CONFIG = {
  // Set false to remove the widget entirely (no launcher, no index built).
  enabled: true,

  // Floating launcher button.
  launcher: { label: "Ask about my work", icon: "message-circle" },

  // Panel header.
  title: "Ask about my work",

  // First message in the transcript, and the honesty line pinned under the header.
  greeting: "Ask me anything about my work — I'll answer with what this résumé actually says.",
  disclaimer: "Not an AI — I search this résumé and quote it back.",

  // Chips offered at the start and after every unanswered question.
  suggestions: [
    "What do you do now?",
    "How did you build an analytics function?",
    "Tell me about Tippani",
    "How many years of experience?",
    "How do I contact you?"
  ],

  // Shown when nothing clears the scoring thresholds below.
  noMatch: "I don't have anything on that in this résumé — I only answer from what's on this page. Try one of these:",

  // Used when something matched but most of the question didn't: the entry is still worth
  // showing, but calling it "the answer" would overclaim.
  partialLeadIn: "I don't have a direct answer for that. The closest thing on my résumé:",

  // Retrieval tuning (BM25). Raise minScore/coverage to make the bot more willing to say
  // "I don't know"; lower them to make it answer more loosely.
  scoring: {
    k1: 1.2,           // term-frequency saturation
    b: 0.6,            // length normalisation
    minScore: 1.2,     // best hit must clear this, or it's a no-match
    coverage: 0.45,    // …and the quoted entries must cover this share of the question's
                       //    information (rare words count for more than common ones) to be
                       //    given as a straight answer
    relCutoff: 0.45,   // keep extra hits scoring at least this fraction of the best one
    // …below that, a match carrying at least this much information is still quoted, but
    // under `partialLeadIn` rather than as a straight answer. Counted in "words the résumé
    // never uses", so it holds its meaning on any profile.
    strongMatch: 0.65,
    maxResults: 3,     // never quote more entries than this in one answer
    maxBullets: 3      // highlight bullets quoted per entry
  },

  // Abuse guard. Slurs and abuse are refused before any matching happens, and the
  // message is replaced by `hiddenLabel` in the transcript instead of being echoed
  // back onto the page. The stem list lives in index.html; add your own context's
  // patterns here (strings, compiled case-insensitively) rather than editing it.
  moderation: {
    enabled: true,
    reply: "I'm not going to engage with that. Ask me something about my work and I'll answer from the résumé.",
    hiddenLabel: "message hidden",
    extraPatterns: []
  },

  // Question-side phrase rewrites, for where the résumé's wording and a visitor's differ.
  // [what they type, what this résumé calls it] — applied to the question only.
  aliases: [
    ["machine learning", "ml"],
    ["deep learning", "ml"],
    ["artificial intelligence", "ai"],
    ["generative ai", "ai"],
    ["gen ai", "ai"],
    ["natural language processing", "nlp"],
    ["business intelligence", "bi"],
    ["supply chain management", "supply chain"],
    ["curriculum vitae", "resume"]
  ],

  // Words ignored when matching. Kept in data so it can be tuned per profile.
  // Two groups: ordinary English glue, and vague evaluative words ("biggest", "good",
  // "know") that appear in questions but carry no signal about WHICH entry is wanted —
  // leaving them in made "do you know python" look like a question about the word "know".
  stopwords: [
    "a", "about", "after", "all", "also", "am", "an", "and", "any", "anything", "are", "as", "at",
    "be", "been", "before", "being", "between", "both", "but", "by", "can", "could", "did", "do",
    "does", "doing", "done", "each", "for", "from", "get", "give", "had", "has", "have", "he",
    "her", "here", "hers", "him", "his", "how", "i", "if", "in", "into", "is", "it", "its", "just",
    "like", "many", "me", "more", "most", "much", "my", "of", "on", "once", "one", "only", "or",
    "other", "our", "out", "over", "please", "said", "same", "say", "she", "should", "so", "some",
    "such", "tell", "than", "that", "the", "their", "them", "then", "there", "these", "they",
    "this", "those", "through", "to", "told", "too", "under", "up", "us", "use", "used", "using",
    "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why",
    "will", "with", "would", "you", "your", "yours",
    "accomplishment", "accomplishments", "achievement", "achievements", "actually", "best",
    "favorite", "favourite",
    "better", "big", "biggest", "ever", "example", "examples", "familiar", "good", "great",
    "greatest", "kind", "know", "knowing", "known", "knows", "main", "major", "need", "proud",
    "current", "currently", "presently", "really", "sort", "still", "stuff", "thing", "things", "want",
    // question framing that says nothing about WHICH entry is wanted
    "describe", "elaborate", "explain", "summarise", "summarize", "walk"
  ]
};
