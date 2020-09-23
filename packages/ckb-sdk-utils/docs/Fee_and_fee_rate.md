# Fee

## How to calculate transaction fee

[Doc](https://docs.nervos.org/docs/essays/faq#how-do-you-calculate-transaction-fee)

The size of a normal 2-in-2-out transaction is 597 bytes so that its virtual size is 601 bytes, there're 4 bytes extra cost in a block.

The fee formula is

```
virtual_tx_size * fee_rate / 1000
```

where:

- virtual_tx_size: size cost in a block, in `bytes`,
- fee_rate: defined by user, in `shannons/kB`;

Suppose the fee rate is `1000 shannons/kB`, the fee of a 2-in-2-out transaction is `601 * 1000 / 1000` shannons, namely **0.00000601 CKB**

## Fee Rate

Decided by users, impacts on the sequence of committing transactions by miners.

## Generate Transaction with Fee Rate

Suppose we have a transaction named `tx`, it has a change output of capacity `change` and it's size is `tx_size`.

When the fee rate is set to `fee_rate`, apparently `fee = tx_size * fee_rate`.

There are two cases:

### change >= minimal_change + fee

The transaction can be updated to have a change output of capacity `change - fee` and that's all.

### change < minimal_change + fee

It's hard to pay the fee by change, so extra inputs are required. There are also two strategies to increase inputs

#### Increase inputs by replacing current inputs

Say we have used an input of 1000 capacity, when we replace it with an input of 2000 capacity, obviously the fee will not change, and the capacity of change output will increase by `2000 - 1000 - fee`.

#### Increase inputs by adding new input

Say we add `n` new inputs, the size bumps to `tx_size + 44 * n` since each input has a size of 44 bytes. By that the fee is `fee + 44 * n * fee_rate`.

In a word, `44 * n * fee_rate` extra cost is introduced by `n` inputs, so the capacity of `n` inputs should be at least `fee - (change - minimal_change) + 44 * n * fee_rate`

Each input has at least 61 CKB, namely at least `61_00_000_000 * n` shannons will be introduced

```
6100000000 * n > (fee - (change - minimal_change) + 44 * n * fee_rate) ->
6100000000 * n - 44 * fee_rate * n > fee + minimal_change - change ->
n > (fee + minimal_change - change) / (6100000000 - 44 * fee_rate)
```

---

Since the dynamic picking of cells is not implemented yet, we're going to use the second strategy, increase inputs by adding new input, for now.
