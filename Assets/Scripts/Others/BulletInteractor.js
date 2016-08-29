#pragma strict

var Origin : Vector3;
var Velocity = Vector3.zero;
var Weapon : int;

private var collided = false;

function Update(){
	GetComponent(CharacterController).Move(Velocity*100*Time.deltaTime);
	if (transform.position.magnitude > 50)
		Destroy(gameObject);
}

function OnControllerColliderHit (object : ControllerColliderHit) {
	if (object.gameObject.tag == "Enemy") {
		var distance = (object.transform.position - Origin).magnitude;
		var damage : double = Level.Primary_Damage(distance);

		if (damage > 0)
			object.gameObject.GetComponent(EnemyInteractor).takeDamage(damage, transform.position);
		Debug.Log("Collided");
		Destroy(gameObject);
	}
}
