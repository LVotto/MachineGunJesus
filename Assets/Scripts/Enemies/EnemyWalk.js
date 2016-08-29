
var player : Transform;

private var finalMove : Vector3;

private var speed : double;
private var runSpeed : double;

private var distance : double;
private var followDirection : Vector3;
private var walkAngle : double;
private var isFollowing : boolean;
private var isResting : boolean;
private var hitDelay : float;
private var restDelay : float;
private var controller;
private var converted = false;
private var changeDelay : float;

function Start(){
	controller = GetComponent(CharacterController);
	walkAngle = Random.value * 2 * Mathf.PI;
	isFollowing = false;
	isResting = false;
	speed = 1;
	runSpeed = 2;
	changeDelay = Time.time + Random.value*5;

	yield WaitForSeconds(1); //Animação de spawn
}

function FixedUpdate(){
	followDirection = transform.position - player.position;

	if(gameObject.name == "EnemyPrefab")
		hitDelay = Time.time + 999999;

	if(hitDelay > Time.time){
		controller.Move(finalMove * 0.25);
		finalMove /= 2;
		isResting = true;

		if(transform.position.y > 0.5){
			finalMove.y -=0.2;
		}
		else{
			finalMove.y = 0;
		}
	}
	else if(isResting && restDelay > Time.time){
		testFollow();
	}
	else if(isFollowing){
		testFollow();
		finalMove = -followDirection;
		finalMove.Normalize();
		finalMove *= runSpeed;
		finalMove.y = 0;
		controller.Move(finalMove * Time.deltaTime);
	}
	else{
		testFollow();
		isResting = false;
		if(Random.value < 0.001){
			isResting = true;
			restDelay = Time.time + Random.value*5;
		}
		calcMove();
		controller.Move(finalMove * Time.deltaTime);
	}

	if(transform.position.y != 0.5)
		transform.position.y = 0.5;
}

function getState() : int {
	if(distance > 10){
		return 3;
	}
	else if(isResting){
		return 0;
	}
	else if(isFollowing){
		return 2;
	}
	else{
		return 1;
	}
}

function getDirection() : float {
	if(isFollowing)
		return 33;
	else
		return walkAngle;
}

function knockBack(origin : Vector3){
	hitDelay = Time.time + 2;
	finalMove = transform.position - origin;
	finalMove.Normalize();
	finalMove *= 2;
	finalMove.y = 0.5;
	isResting = false;
	walkAngle = Mathf.Asin(finalMove.x);
}

function calcMove(){
	if(Time.time > changeDelay){
		changeDelay = Time.time + Random.value*5;
		walkAngle += Random.value*1 - 0.5;
	}

	if(walkAngle > 2*Mathf.PI)
		walkAngle -= 2*Mathf.PI;
	else if(walkAngle < 0)
		walkAngle += 2*Mathf.PI;

	finalMove.x = Mathf.Sin(walkAngle);
	finalMove.y = 0;
	finalMove.z = Mathf.Cos(walkAngle);
	finalMove *= speed;
}

function testFollow(){
	if(converted){
		isFollowing = true;
		isResting = false;
		return;
	}

	distance = Vector3.Magnitude(transform.position - player.position);

	if(distance > 8)
		isFollowing = false;
	else if(distance < 6){
		isFollowing = true;
		isResting = false;
	}
}

function Convert(target : Transform){
	player = target;
	converted = true;
}

function Invert(){
	walkAngle += Mathf.PI/2;
}