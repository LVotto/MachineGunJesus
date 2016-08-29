#pragma strict

private var HP : float;
private var strengh : float;
private var converted = false;

function Start(){
	Level.addWaveEnemy();
	strengh = 20;
	HP = 50;
}

function takeDamage(amt : float, origin : Vector3){
	HP -= amt;

	if(HP <= 0){
		Die();
	}

	GetComponent(EnemyTextureAnimator).setDamage(50 - HP);
	GetComponent(WaveWalk).knockBack(origin);
}

function Die(){
	Level.waveEnemies.Remove(gameObject);
	Destroy(gameObject);
}

function Convert(){
	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	var min = 100;
	var chosen : GameObject = null;
	
	for(var enemy : GameObject in enemies){
		var distance = enemy.transform.position - transform.position;
		if(distance.magnitude < min && distance.magnitude > 0){
			min = distance.magnitude;
			chosen = enemy;
		}
	}

	if(chosen != null){
		GetComponent(EnemyWalk).Convert(chosen.transform);
		converted = true;
	}
}

//Não funciona o Physics.IgnoreCollision e n faço ideia de pq.... ;-;
function OnControllerColliderHit(hit : ControllerColliderHit){
	if(hit.gameObject.tag == "Player" && !converted){
		GetComponent(WaveWalk).knockBack(hit.transform.position);
		hit.gameObject.GetComponent(PlayerInteractor).takeDamage(strengh);
	}
	else if(hit.gameObject.tag == "Enemy" && converted){
		Destroy(hit.gameObject);
		Destroy(gameObject);
	}
	else if(hit.gameObject.tag == "Ammo" || hit.gameObject.tag == "Life"){
		Physics.IgnoreCollision(GetComponent(Collider), hit.collider);
	}
}