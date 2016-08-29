#pragma strict

var player : Transform;

private var LockedEnemy : GameObject;
private var Shots = 5;
private var shootDelay = 0;
private var range = 4;

function Start () {
	LockedEnemy = null;
}

function Update () {
	Rotate();
	if(LockedEnemy != null && Shots > 0){
		if(Time.time > shootDelay){
			Shoot();
			shootDelay = Time.time + 3;
		}
	}
	else {
		SearchEnemy();
	}
}

function Shoot(){
	Shots--;
	
	LockedEnemy.GetComponent(EnemyInteractor).takeDamage(10, transform.position);
}

function isDead() : boolean{
	if(Shots <= 0)
		return true;
	else
		return false;
}

function Rotate(){
	var direction : float;

	transform.rotation = Quaternion.LookRotation(transform.position - player.position);
	transform.rotation.x = 0;
	transform.rotation.z = 0;

	if(LockedEnemy != null)
		direction = Quaternion.LookRotation(transform.position - LockedEnemy.transform.position).y;
	else
		direction = -1;

	//Selecionar textura a partir dos angulos
}

function Remove(){
	Shots = 0;
	Debug.Log("Remove");
}

function SearchEnemy(){
	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	var min = 100;
	var chosen : GameObject = null;
	
	for(var enemy : GameObject in enemies){
		var distance = enemy.transform.position - transform.position;
		if(distance.magnitude < range && distance.magnitude < min && distance.magnitude > 0){
			min = distance.magnitude;
			chosen = enemy;
		}
	}

	LockedEnemy = chosen;
}
