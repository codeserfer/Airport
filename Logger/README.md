# Logger

Сервис предназначен для логирования действий подсистем аэропорта.

Поставляется в виде двух компонентов: **QueueListener** и непосредственно **Logger**

## QueueListener

Написан на Python.
Слушает очередь rabbitMQ и забирает из нее все сообщения, обрабатывает их и складывает в mysql базу.

### Формат тело сообщения:
Тело сообщения должно быть сериализовано в JSON следующего вида:
{'component': <component>, 'status': <status>, 'text': <text>}

Возможные компоненты:
time, information_panel, passenger, visualization, tower_control, logger, ground_control, handling_supervisor, plane, board, refueler, follow_me_van, catering_truck, passenger_bus, baggage_tractor, passenger_stairs, container_loader, vip_shuttle.

Возможные статусы:
information, error.

Можно в заголовок сообщения _timestamp_ добавить timestamp, когда произошло событие. Иначе, QueueListener вставит текущий timestamp сам.

## Logger

Компонет состоит из двух частей: *серверной части* и *клиентской части*

### Серверная часть

Написана на Python.

Предоставляет REST API по адресу */api/list* по порту 8052.

Возвращает список всех логов в JSON формате в виде:

[{"status": "information", "date": "2016-03-13 14:27", "component": "baggage tractor", "id": 28, "text": "Hey!"}, {"status": "information", "date": "2016-03-13 14:27", "component": "baggage tractor", "id": 29, "text": "Hey!"}]

Может принимать в качестве аргумента *status* и *component*.

### Клиентская часть

Написана на angularjs + ngTable + bootstrap.

Представляет собой веб-интерфейс для удобного просмотра логов. Поддерживает автоматическую пагинацию.

Раз в 5 секунд запрашивает у сервера логи и обновляет таблицу.
