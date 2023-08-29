import time
import statistics
import board
from adafruit_seesaw.seesaw import Seesaw


def main():
    try:
        i2c_bus = board.I2C()  # uses board.SCL and board.SDA
        ss = Seesaw(i2c_bus, addr=0x36)
        readings = []

        while len(readings) < 10:
            # read moisture level through capacitive touch pad
            touch = ss.moisture_read()
            readings.append(touch)

        median = statistics.median(readings)
        mean = sum(readings) / len(readings)
    except TypeError:
        print(
            str(
                {"Error": "Error getting temperature or humidity", "Message": TypeError}
            ).replace("'", '"')
        )
    else:
        print(str({"median": median, "mean": mean}).replace("'", '"'))


main()
