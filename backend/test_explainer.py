from ai.inference.predictor import GroomingPredictor

predictor = GroomingPredictor()

result = predictor.predict_with_explanation(
    [
        "Hello.",
        "How old are you?",
        "Do your parents know you're chatting online?",
        "Can we keep this between us?"
    ]
)

print(result)