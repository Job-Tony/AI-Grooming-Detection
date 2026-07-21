from torch.utils.data import DataLoader

from ai.data.dataset import GroomingDataset


def create_dataloader(
    examples,
    batch_size: int = 8,
    shuffle: bool = True,
):
    dataset = GroomingDataset(examples)

    return DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=shuffle,
    )