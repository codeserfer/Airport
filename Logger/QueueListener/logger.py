import time
import datetime

def log (s):
    print "%s: %s" % (datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S'), s)
