import datetime

class TimeKeeper:
    def __init__(self, current_time):
        self.current_time = current_time
        self.time_last_watered = None
    
    def set_current_time(self, updated_time):
        self.current_time = updated_time

    def set_time_last_watered(self, updated_time):
        self.time_last_watered = updated_time

    def get_difference_in_weeks(self, date_str2):
        # Convert date strings to datetime objects
        date_format = "%I:%M:%S %p"
        date1 = datetime.strptime(self.current_time, date_format)
        date2 = datetime.strptime(date_str2, date_format)
        
        # Calculate the difference between the datetime objects
        time_difference = date2 - date1
        
        # Convert the time difference to weeks
        # weeks_difference = time_difference.days / 7
        time_difference.total_seconds() / 60
        
        return weeks_difference

    @staticmethod
    def get_current_time():
        now = datetime.datetime.now()
        return now.strftime("%I:%M:%S %p")