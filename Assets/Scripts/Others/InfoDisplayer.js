#pragma strict

var player : GameObject;

function OnGUI () {
	GUI.Label (Rect (25, 20, 100, 30), "Health Packs :" + player.GetComponent(PlayerInteractor).getHealthPacks().ToString());
	GUI.Label (Rect (25, 50, 100, 30), "HP :" + player.GetComponent(PlayerInteractor).getHP().ToString());
	GUI.Label (Rect (25, 100, 100, 30), "Magazines :" + player.GetComponent(PlayerInteractor).getAmmoPacks().ToString());
	GUI.Label (Rect (25, 130, 100, 30), "Shots :" + player.GetComponent(PlayerInteractor).getShots().ToString());
	GUI.Label (Rect (25, 170, 100, 30), "Hability :" + player.GetComponent(PlayerInteractor).getSelectedHability().ToString());
	GUI.Label (Rect (25, 210, 100, 30), "Blessed :" + player.GetComponent(PlayerInteractor).getBlessed().ToString());

	if(player.GetComponent(PlayerInteractor).isDead){
		GUI.Label (Rect (500, 200, 300, 50), "YOU DIED");
		GUI.Label (Rect (500, 250, 300, 50), "Score: " + Level.score.ToString());
		GUI.Label (Rect (500, 300, 300, 50), "Time: " + player.GetComponent(PlayerInteractor).gameTime);
	}
}