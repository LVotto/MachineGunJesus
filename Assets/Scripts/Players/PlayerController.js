
var walkSpeed = 1.0;
var runSpeed = 2.0;
var duckSpeed = 0.5;
 
var limitDiagonalSpeed = true;
var toggleRun = false;
 
var jumpSpeed = 2.0;
var gravity = 5.0;
 
var antiBumpFactor = .75;
var hitDelay = 0.5;

var knockbackStrenght = 0.25;

var standHeight = 0.5;
var duckHeight = 0.25;

var cameraTransform : Transform;

var StepClip : AudioClip;
private var Step : AudioSource;
private var stepDelay : float = 0.0;
 
private var moveDirection = Vector3.zero;
private var grounded = false;
private var controller : CharacterController;
private var myTransform : Transform;
private var speed : float;
private var hit : RaycastHit;
private var fallStartLevel : float;
private var falling = false;
private var slideLimit : float;
private var rayDistance : float;
private var contactPoint : Vector3;
private var playerControl = false;
private var duckToggle : boolean;
 
function Start () {
	controller = GetComponent(CharacterController);
	myTransform = transform;
	speed = walkSpeed;
	duckToggle = false;
	Step = gameObject.AddComponent(AudioSource);
	Step.clip = StepClip;
}
 
function FixedUpdate() {
	var inputX = Input.GetAxis("Horizontal");
	var inputY = Input.GetAxis("Vertical");
	
	var inputModifyFactor = (inputX != 0.0 && inputY != 0.0 && limitDiagonalSpeed)? .7071 : 1.0;
 
	if (grounded) { 
		if (!toggleRun) 
			speed = Input.GetButton("Run")? runSpeed : walkSpeed;
		
		if (duckToggle)
			speed = duckSpeed;
 
		moveDirection = Vector3(inputX * inputModifyFactor, -antiBumpFactor, inputY * inputModifyFactor);
		moveDirection = myTransform.TransformDirection(moveDirection) * speed;
		playerControl = true;
 
		if (Input.GetButton("Jump")) {
			moveDirection.y = jumpSpeed;
		}
	}
 
	moveDirection.y -= gravity * Time.deltaTime;
 
	grounded = (controller.Move(moveDirection * Time.deltaTime) & CollisionFlags.Below) != 0;

	if((moveDirection.x != 0 || moveDirection.z != 0) && Time.time > stepDelay && grounded){
		Step.Play(0.5);
		stepDelay = Time.time + walkSpeed/(speed + 2);
	}
}
 
function Update () {
	if (Input.GetButtonDown("Duck")) {
		duckToggle = true;
		cameraTransform.position.y -= 0.3;
	}
	else if (Input.GetButtonUp("Duck")) {
		duckToggle = false;
		cameraTransform.position.y += 0.3;
	}
	
	if (toggleRun && grounded && Input.GetButtonDown("Run") && !duckToggle)
		speed = (speed == walkSpeed? runSpeed : walkSpeed);
}

function getToggle (type : String) : boolean {
	if (type == "Duck")
		return duckToggle;
	else if (type == "Run")
		return (speed == runSpeed);
	else if (type == "Walk")
		return (moveDirection.x + moveDirection.z != 0);
}

@script RequireComponent(CharacterController)
