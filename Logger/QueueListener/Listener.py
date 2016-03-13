import pika
from config import config
from logger import log
import time
import json
import MySQLdb
import datetime

connection = pika.BlockingConnection(pika.ConnectionParameters(host=config.get('rabbitmq', 'server')))
channel = connection.channel()

class payload(object):
    def __init__(self, j):
        self.__dict__ = json.loads(j)

components_list = [
    'time',
    'information_panel',
    'passenger',
    'visualization',
    'tower_control',
    'logger',
    'ground_control',
    'handling_supervisor',
    'plane',
    'board',
    'refueler',
    'follow_me_van',
    'catering_truck',
    'passenger_bus',
    'baggage_tractor',
    'passenger_stairs',
    'container_loader',
    'vip_shuttle'];

status_list = ['information', 'error']

def listen_queue(ch, method, properties, body):
    has_errors = False
    errors = ""

    body = payload(body)
    
    if hasattr (body, 'component'):
	log ("component: %s" % body.component)
	
	body.component = body.component.lower()
	
	if body.component not in components_list:
	    has_errors = True
	    errors+="No such component: %s" % body.component
	    log ("No such component: %s" % body.component)

    else:
	log ("component is None!!! Fuck")
	has_errors = True
	errors+="Component is None"

    if hasattr (body, 'status'):
    
	body.status = body.status.lower()
    
	if body.status not in status_list:
	    has_errors = True
	    errors+="No such status: %s" % body.status
	    log ("No such status: %s" % body.status)
	else:
	    log ("status: %s" % body.status)
    else:
	log ("status is None! Fuck too!")
	has_errors = True
	errors+="Status is None"

    if hasattr (body, 'text'):
	log ("text: %s" % body.text)
    else:
	log ("text is None! Fuck!!!")
	has_errors = True
	errors+="Body is None"

    if properties.timestamp is None:
	properties.timestamp =datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
	log ("My timestamp")
    else:
	properties.timestamp=datetime.datetime.fromtimestamp(properties.timestamp).strftime('%Y-%m-%d %H:%M:%S')
	
    log ("timestamp is %s" % properties.timestamp)
    
    # push to db

    db = MySQLdb.connect(host = config.get('local','host')
                             , user         = config.get('local','user')
                             , passwd       = config.get('local','pass')
                             , db           = config.get('local','db')
                             , charset      = 'utf8'
                             , use_unicode  = True)

    cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)

    if has_errors:
	log ("Too much errors")
        
        query = 'insert into logs (date, component, status, text) values ("%s", "Logger", "Error", "%s")' % (properties.timestamp, errors)
        
	log (query)	
        cursor.execute (query)
    else:
    	query = 'insert into logs (date, component, status, text) values ("%s", "%s", "%s", "%s")' % (properties.timestamp, body.component, body.status, body.text)
    
	log (query)
	cursor.execute (query)

    cursor.close()
    db.commit()
    
    
# listening queue
channel.basic_consume(listen_queue, queue=config.get('rabbitmq', 'queue'), no_ack=True)

log (' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
