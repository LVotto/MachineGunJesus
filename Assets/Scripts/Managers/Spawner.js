#pragma strict

var player : Transform;

var LifePrefab : GameObject;
var AmmoPrefab : GameObject;
var EnemyPrefab : GameObject;

var chaoGrama : Texture2D;
var chaoRua : Texture2D;
var chaoCemiterio : Texture2D;
var chaoPraca : Texture2D;
var chaoPoco : Texture2D;

var groundN : int;
static var playerOn : int;

private var EnemyRisc : double;
private var ItemRisc : double;
private var EnemyMaxRisc : double;
private var ItemMaxRisc : double;

function Start () {
	while(true){
		yield WaitForSeconds(2);

		if(playerOn != groundN){
			if(!Level.isFullItem()) SpawnItem();
			if(!Level.isFullEnemy()) SpawnEnemy();
		}
		
		UpdateRisk();
	}
}

function UpdateRisk(){
	var distance = (player.position - transform.position).magnitude;

	EnemyMaxRisc = Mathf.Exp(-(distance*distance)/1000);
	ItemMaxRisc = 1 - EnemyMaxRisc;
	
	EnemyRisc += (EnemyMaxRisc - EnemyRisc)/3;
	ItemRisc += (ItemMaxRisc - ItemRisc)/3;
}

function SpawnItem(){
	if(Random.value < ItemRisc){
		var chance = Random.value;
		var spawnrange = 20;
		var position = transform.position;
		
	
		if(chance >= 0.5){
			var newLife : GameObject;
			position.x += spawnrange*Random.value - spawnrange/2;
			position.z += spawnrange*Random.value - spawnrange/2;
			position.y = 0.5;
		
			newLife = Instantiate(LifePrefab, position, transform.rotation) as GameObject;
		}
		else{
			var newAmmo : GameObject;
			position.x += spawnrange*Random.value - spawnrange/2;
			position.z += spawnrange*Random.value - spawnrange/2;
			position.y = 0.5;
		
			newAmmo = Instantiate(AmmoPrefab, position, transform.rotation) as GameObject;
		}
	}
}

function SpawnEnemy(){
	var newEnemy : GameObject;
	var chance = Random.value;
	var spawnrange = 20;
	
	if(chance <= EnemyRisc){//getEnemyMaxRisc()*100){
		var position = transform.position;
		position.x += spawnrange*Random.value - spawnrange/2;
		position.y = 0.5;
		position.z += spawnrange*Random.value - spawnrange/2;
		
		newEnemy = Instantiate(EnemyPrefab, position, transform.rotation) as GameObject;
	}
}

static function setPlayerOn(ground : int){
	playerOn = ground;
}

function buildPasto(){
	GetComponent.<Renderer>().material.mainTexture = chaoGrama;
}

function buildPraca(){
	GetComponent.<Renderer>().material.mainTexture = chaoGrama;
}

function buildPoco(){
	GetComponent.<Renderer>().material.mainTexture = chaoPoco;
}

function buildMercado(){
	GetComponent.<Renderer>().material.mainTexture = chaoRua;
}

function buildFlores(){
	GetComponent.<Renderer>().material.mainTexture = chaoGrama;
}

function buildPedra(){
	GetComponent.<Renderer>().material.mainTexture = chaoGrama;
}

function buildCasa(){
	GetComponent.<Renderer>().material.mainTexture = chaoPraca;
}

function buildCasas(){
	GetComponent.<Renderer>().material.mainTexture = chaoRua;
}

function buildIgreja(){
	GetComponent.<Renderer>().material.mainTexture = chaoRua;
}

function buildCemiterio(){
	GetComponent.<Renderer>().material.mainTexture = chaoCemiterio;
}

function buildPlanicie(){
	GetComponent.<Renderer>().material.mainTexture = chaoGrama;
}

function buildCruzes(){
	GetComponent.<Renderer>().material.mainTexture = chaoCemiterio;
}