import json
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, TrainingArguments, Trainer

# Loading the file (jsonl)
dataset = []
with open("C:\\Users\\44775\\OneDrive\\Documents\\University\\AnxietyFit-Chatbot\\dataset\\dataForGodel.jsonl", "r", encoding="utf-8") as file:
    for line in file:
        if line.strip():
            dataset.append(json.loads(line))

# Format for godel
formatted_data = [{
    "input": f"Instruction: given a dialog context, respond appropriately.\nInput: {entry['source']}",
    "target": entry["target"]
} for entry in dataset]

hf_dataset = Dataset.from_dict({
    "input": [item["input"] for item in formatted_data],
    "target": [item["target"] for item in formatted_data]
})

# Tokenizer and model
model_name = "microsoft/GODEL-v1_1-base-seq2seq"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Tokenization
def preprocess_function(examples):
    model_inputs = tokenizer(
        examples["input"],
        max_length=512,
        padding="max_length",
        truncation=True
    )
    with tokenizer.as_target_tokenizer():
        labels = tokenizer(
            examples["target"],
            max_length=128,
            padding="max_length",
            truncation=True
        )
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

tokenized_dataset = hf_dataset.map(preprocess_function, batched=True)

# Training the model
training_args = TrainingArguments(
    output_dir="./godelFinetuned",
    learning_rate=3e-5,
    per_device_train_batch_size=4,
    num_train_epochs=5,
    weight_decay=0.01,
    logging_dir="./logs",
    evaluation_strategy="no",
    save_total_limit=2
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset
)

trainer.train()

model.save_pretrained("./godelFinetuned")
tokenizer.save_pretrained("./godelFinetuned")
