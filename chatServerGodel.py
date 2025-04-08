from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__)
CORS(app)

# Load finetinued godel version
model_path = "./godelFinetuned"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

@app.route("/get-response", methods=["POST"])
def get_response():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        prompt = f"Instruction: given a dialog context, respond appropriately.\nInput: {user_message}\n"
        inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True, max_length=512)

        output = model.generate(
            inputs["input_ids"],
            max_length=128,
            num_beams=5, #4
            do_sample=False, #true
            top_p=0.9,
            temperature=0.7,
            early_stopping=True
        )

        response_text = tokenizer.decode(output[0], skip_special_tokens=True)
        return jsonify({"response": response_text})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
