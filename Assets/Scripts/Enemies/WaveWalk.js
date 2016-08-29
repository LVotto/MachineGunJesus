
var player : Transform;

private var finalMove : Vector3;
var globalBest : Vector3;

private var speed : double;
private var runSpeed : double;

private var distance : double;
private var followDirection : Vector3;
private var isFollowing : boolean;
private var hitDelay : float;
private var restDelay : float;
private var controller;
private var converted = false;
private var changeDelay : float;

var best = Vector3.zero;
var bestValue = 10000;

private var ci : float;
private var cp : float;
private var cg : float;

function Start(){
	controller = GetComponent(CharacterController);
	walkAngle = Random.value * 2 * Mathf.PI;
	isFollowing = false;
	speed = 1;
	runSpeed = 2;
	changeDelay = Time.time + Random.value*5;
	ci = Random.value/2 + 0.5;
	cp = Random.value/2 + 0.5;
	cg = Random.value/2 + 0.5;

	yield WaitForSeconds(1); //Animação de spawn
}

function FixedUpdate(){
	followDirection = transform.position - player.position;

	if(gameObject.name == "WavePrefab")
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
		calcMove();
		controller.Move(finalMove * Time.deltaTime);
	}

	if(transform.position.y != 0.5)
		transform.position.y = 0.5;
}

function calcMove(){
	var bp = transform.position - best;
	var bg = transform.position - globalBest;

	finalMove.x = -(ci*finalMove.x + cp*bp.x + cg*bg.x);
	finalMove.y = 0;
	finalMove.z = -(ci*finalMove.z + cp*bp.z + cg*bg.z);

	finalMove.Normalize();
}

function getState() : int {
	if(distance > 10){
		return 3;
	}
	else if(isFollowing){
		return 2;
	}
	else{
		return 1;
	}
}

function getDirection() : float {
	// if(isFollowing)
		return 33;
	// else
	// 	return walkAngle;
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

function testFollow(){
	if(converted){
		isFollowing = true;
		return;
	}

	distance = Vector3.Magnitude(transform.position - player.position);

	if(distance <= bestValue){
		bestValue = distance;
		best = transform.position;
	}

	if(distance > 8)
		isFollowing = false;
	else if(distance < 6){
		isFollowing = true;
	}
}

function Convert(target : Transform){
	player = target;
	converted = true;
}