from classes import Hardware
import time
import sys

RELAY = Hardware.Relay(14, False)


def water_plant(relay, seconds):
    print("Plant is being watered!")
    relay.on()
    time.sleep(seconds)
    print("Watering is finished!")
    relay.off()


def main():
    water_plant(RELAY, int(sys.argv[1], 10))


main()
