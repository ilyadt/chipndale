# Chipndale v1.0

A tool for splitting/recovering secrets of any length more than 8 bytes.

Shares have the same length as the secret and share structure is random.
Decoy secret and plausibly deny the existence of real secret.
There is no way for the coercer to prove that the decoy secret is not the real one.

Based on Shamir's Secret Sharing K-of-N over Galois Field GF(256) with 0x11b polynomial.

## Specification

The full process of splitting/recovering secret can be found [here](./SPEC.md).
The specification is final and won't change, so you will be sure, you can recover you secrets anyway.

## Implementation

The source code of library is written in javascript and can be found in [./src/core](./src/core) with no external dependencies.

## Online tool

You can try this tool online on https://ilyadt.github.io/chipndale/

## Tests

Library is covered with tests

[Test vectors](./src/core/test_vectors.json)

Run tests from the command-line: 
```
npm run tests
```

## Donations

You can support or contact me. 

BTC: bc1qgdwm02m9jeqvq3jwxym5vdpny69x5e7px33d22

Contact info: ilya_dt@pm.me

