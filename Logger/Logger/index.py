# FLASK
from flask import Flask
from flask import request
from flask import abort
from flask import g

import MySQLdb
from config import config
import json

# Initialization
app = Flask(__name__)


@app.route('/api/list')
def list_of_logs ():
    try:
	# getting args
	start_date = request.args.get('start_date', None)
	finish_date = request.args.get('finish_date', None)
	component = request.args.get('component', None)
	status = request.args.get('status', None)


	filters = []

	if start_date is not None:
	    filters.append("start_date >= %s" % start_date)

	if finish_date is not None:
	    filters.append("finish_date <= %s" % finish_date)

	if component is not None:
	    filters.append("component = \"%s\"" % component)

	if status is not None:
	    filters.append("status = \"%s\"" % status)


	string_filters=""

	if len(filters) > 0:
            string_filters = " where "
            string_filters += " and ".join(filters)
	

	query = "select id, status, date, component, text from logs" + string_filters

	print ("query: %s" % query)


	db = MySQLdb.connect(host = config.get('local','host')
                             , user         = config.get('local','user')
                             , passwd       = config.get('local','pass')
                             , db           = config.get('local','db')
                             , charset      = 'utf8'
                             , use_unicode  = True)

	cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)

	cursor.execute (query)

	logs = cursor.fetchall()

	for log in logs:
	    if log['date'] is not None:
            	log['date'] = log['date'].strftime("%Y-%m-%d %H:%M")
            log['component'] = log['component'].replace("_", " ")


	cursor.close()
	db.commit()

	return json.dumps (logs)
    except Exception, e:
        print ('Error: %s' % e)
        abort(500)


if __name__ == '__main__':
    port_specified = 8052
    app.run(port=port_specified)
