from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, List, Tuple


# V6 monoid action for SB688 braid topology.
# Evidence is an append-only log L. Crossings append; they never erase.
# sigma_i is NOT claimed to be bijective. It is a positive monoid endomorphism.


@dataclass(frozen=True)
class BraidState:
    """State carried by a braid strand under the V6 monoid law.

    P: permutation / payload identity
    L: append-only evidence log (list of event tokens)
    tau: trust / policy fingerprint
    Pi: provenance / authority metadata
    """

    P: Any
    L: Tuple[str, ...]
    tau: Any
    Pi: Any

    @property
    def length(self) -> int:
        return len(self.L)


class PositiveBraidMonoid:
    """Positive braid monoid action B_n^+ -> End(S).

    Forward crossings append e_i.
    Reverse crossings append a distinct e_i_rev token.
    No inverse cancels evidence. Log only grows.
    """

    def __init__(self, n: int = 3) -> None:
        if n < 2:
            raise ValueError("braid needs at least 2 strands")
        self.n = n

    def _apply_perm(self, P: Any, i: int) -> Any:
        """Apply generator action on payload. Default: tuple swap if P is a tuple."""
        if isinstance(P, tuple) and 0 <= i < len(P) - 1:
            lst = list(P)
            lst[i], lst[i + 1] = lst[i + 1], lst[i]
            return tuple(lst)
        return P

    def sigma(self, state: BraidState, i: int, token: str | None = None) -> BraidState:
        """Forward crossing sigma_i: append e_i, apply perm."""
        if not (0 <= i < self.n - 1):
            raise IndexError(f"generator index {i} out of range for n={self.n}")
        ev = token or f"e_{i}"
        new_P = self._apply_perm(state.P, i)
        new_L = state.L + (ev,)
        return BraidState(new_P, new_L, state.tau, state.Pi)

    def sigma_rev(self, state: BraidState, i: int, token: str | None = None) -> BraidState:
        """Reverse crossing: append a DISTINCT reverse token. Not a mathematical inverse."""
        if not (0 <= i < self.n - 1):
            raise IndexError(f"generator index {i} out of range for n={self.n}")
        ev = token or f"e_{i}_rev"
        new_P = self._apply_perm(state.P, i)
        new_L = state.L + (ev,)
        return BraidState(new_P, new_L, state.tau, state.Pi)

    def compose(self, state: BraidState, word: List[Tuple[str, int]]) -> BraidState:
        """Apply a word of ('fwd'| 'rev', index) crossings."""
        cur = state
        for kind, i in word:
            if kind == "fwd":
                cur = self.sigma(cur, i)
            elif kind == "rev":
                cur = self.sigma_rev(cur, i)
            else:
                raise ValueError(f"unknown crossing kind: {kind}")
        return cur

    # ---- invariants ----

    @staticmethod
    def far_commutes(state: BraidState, i: int, j: int, monoid: "PositiveBraidMonoid") -> bool:
        """sigma_i sigma_j == sigma_j sigma_i for |i-j| >= 2."""
        if abs(i - j) < 2:
            return True
        a = monoid.sigma(monoid.sigma(state, i), j)
        b = monoid.sigma(monoid.sigma(state, j), i)
        return a.P == b.P and a.L == b.L

    @staticmethod
    def braid_relation(state: BraidState, i: int, monoid: "PositiveBraidMonoid") -> bool:
        """sigma_i sigma_{i+1} sigma_i == sigma_{i+1} sigma_i sigma_{i+1}."""
        a = monoid.sigma(monoid.sigma(monoid.sigma(state, i), i + 1), i)
        b = monoid.sigma(monoid.sigma(monoid.sigma(state, i + 1), i), i + 1)
        return a.P == b.P and a.L == b.L

    @staticmethod
    def injective_append(state_a: BraidState, state_b: BraidState, monoid: "PositiveBraidMonoid", i: int) -> bool:
        """V6 core check: distinct logs must not collapse under sigma_i."""
        if state_a.L == state_b.L and state_a.P == state_b.P:
            return True
        out_a = monoid.sigma(state_a, i)
        out_b = monoid.sigma(state_b, i)
        return not (out_a.L == out_b.L and out_a.P == out_b.P and state_a.L != state_b.L)
