from __future__ import annotations

import torch

# ==========================
# Training
# ==========================

EPOCHS = 5
BATCH_SIZE = 16

# ==========================
# Optimizer
# ==========================

LEARNING_RATE = 2e-5
WEIGHT_DECAY = 0.01

# ==========================
# Learning Rate Scheduler
# ==========================

WARMUP_RATIO = 0.1

# ==========================
# Gradient Clipping
# ==========================

MAX_GRAD_NORM = 1.0

# ==========================
# Early Stopping
# ==========================

EARLY_STOPPING_PATIENCE = 3
MINIMUM_IMPROVEMENT = 1e-4

# ==========================
# Checkpoint
# ==========================

SAVE_DIRECTORY = "checkpoints"
MODEL_NAME = "grooming_model.pt"

# ==========================
# Device
# ==========================

DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)