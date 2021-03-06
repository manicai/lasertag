import sys
import os
import asyncio

# Not definitive but good enough to differentiate between a dev machine and
# a Pi. There wouldn't be a ExplorerHAT on a different ARM architecture.
IS_RASPBERRY_PI = (os.uname()[4] == 'armv6l')

try:
    import explorerhat as eh
except:
    print("Could not import ExplorerHAT module", file=sys.stderr, flush=True)
    if IS_RASPBERRY_PI:
        raise
    else:
        eh = None


MOTOR_SCALE = 75.0


class Robot:
    def __init__(self):
        pass

    async def shoot(self):
        print("Shoot")
        if eh:
            eh.output.one.on()
            await asyncio.sleep(1)
            eh.output.one.off()

    async def move(self, left_motor: float, right_motor: float):
        print(f"Set speed to {left_motor}, {right_motor})")
        if eh:
            eh.motor.one.speed(left_motor * MOTOR_SCALE)
            eh.motor.two.speed(right_motor * -MOTOR_SCALE)

    async def is_hit(self) -> bool:
        if eh:
            signal = eh.analog.one.read()
            return signal > 4.0
        return False
