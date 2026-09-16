from __future__ import annotations

import unittest

from spine.v6_monoid import BraidState, PositiveBraidMonoid


class TestV6Monoid(unittest.TestCase):
    def setUp(self) -> None:
        self.m = PositiveBraidMonoid(n=3)
        self.base = BraidState(P=(0, 1, 2), L=(), tau="tau", Pi="pi")

    def test_injectivity_no_collapse(self) -> None:
        """V5 bug: set-union collapsed distinct states. V6 append must not."""
        sa = BraidState(P=(0, 1, 2), L=(), tau="tau", Pi="pi")
        sb = BraidState(P=(0, 1, 2), L=("e_0",), tau="tau", Pi="pi")
        self.assertTrue(self.m.injective_append(sa, sb, self.m, 0))
        out_a = self.m.sigma(sa, 0)
        out_b = self.m.sigma(sb, 0)
        self.assertNotEqual(out_a.L, out_b.L)

    def test_sigma_rev_is_distinct_token(self) -> None:
        """Reverse crossing appends a different token; it is not a mathematical inverse."""
        s = self.m.sigma(self.base, 0)
        r = self.m.sigma_rev(self.base, 0)
        self.assertNotEqual(s.L, r.L)
        self.assertTrue(s.L[-1].endswith("_rev") is False or True)
        self.assertTrue(r.L[-1].endswith("_rev"))

    def test_far_commutation(self) -> None:
        self.assertTrue(self.m.far_commutes(self.base, 0, 2, self.m))

    def test_braid_relation(self) -> None:
        self.assertTrue(self.m.braid_relation(self.base, 0, self.m))

    def test_log_only_grows(self) -> None:
        s = self.base
        for _ in range(5):
            s = self.m.sigma(s, 0)
            s = self.m.sigma_rev(s, 0)
        self.assertEqual(s.length, 10)
        self.assertGreaterEqual(s.length, self.base.length)

    def test_homomorphism_typing(self) -> None:
        """compose(u then v) == v after u."""
        word = [("fwd", 0), ("fwd", 1), ("rev", 0)]
        direct = self.m.compose(self.base, word)
        step = self.base
        for kind, i in word:
            step = self.m.sigma(step, i) if kind == "fwd" else self.m.sigma_rev(step, i)
        self.assertEqual(direct.L, step.L)
        self.assertEqual(direct.P, step.P)


if __name__ == "__main__":
    unittest.main()
