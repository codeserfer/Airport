delimiter //
drop  procedure if exists hold_free_runway;
create procedure hold_free_runway(IN car_id int(11))
BEGIN
	declare free_id int(11) default null;

	START TRANSACTION;
	select id into free_id
	from runways
	where plane_id is NULL
	limit 1
	FOR UPDATE;

	if free_id is not null then
	    update runways set plane_id = car_id where id = free_id;
	    select "OK" as status, 0 as error, free_id as placeId;
	else
	    select "No free runways" as status, 1 as error, NULL as id;
	end if;

	commit;
end;//
delimiter ;




delimiter //
drop  procedure if exists hold_free_parking;
create procedure hold_free_parking(IN car_id int(11))
BEGIN
	declare free_id int(11) default null;

	START TRANSACTION;
	select id into free_id
	from parkings
	where plane_id is NULL
	limit 1
	FOR UPDATE;

	if free_id is not null then
	    update parkings set plane_id = car_id where id = free_id;
	    select "OK" as status, 0 as error, free_id as placeId;
	else
	    select "No free parking" as status, 1 as error, NULL as id;
	end if;

	commit;
end;//
delimiter ;
