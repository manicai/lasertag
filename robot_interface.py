
class Robot:
    def __init__(self):
        pass

    def shoot(self):
        print("Shoot");

    def move(self, left_motor: float, right_motor: float):
        print(f"Set speed to {left_motor}, {right_motor})")

    def is_hit(self) -> bool:
        return False
