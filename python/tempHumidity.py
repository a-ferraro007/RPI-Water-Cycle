import adafruit_dht


def main():
    try:
        device = adafruit_dht.DHT11(17)
        temp = (device.temperature * 1.8) + 32
        humidity = device.humidity
    except TypeError:
        print(
            str(
                {"Error": "Error getting temperature or humidity", "Message": TypeError}
            ).replace("'", '"')
        )
    else:
        print(str({"temp": temp, "humidity": humidity}).replace("'", '"'))


main()
