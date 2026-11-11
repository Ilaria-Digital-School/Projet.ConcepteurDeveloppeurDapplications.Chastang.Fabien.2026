"""Divise a par b. Diviser par zéro lève une erreur."""


def diviser(a, b):
    if b == 0:
        raise ValueError("Division par zéro")
    return a / b
