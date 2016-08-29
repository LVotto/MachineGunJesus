//==================================================================//
//	Lucas Marques Rovere - 04/09/15
//
//	Descricao:
//	Esse script define o movimento de camera, ou a visao do player.
//	Ele deve ser aplicado tanto ao objeto do player, quanto a camera
//	que esta presa a ele. Isso por que o primeiro deve apenas virar
//	no eixo y (levando a camera junto) e o segundo nos outros; voce
//	nao quer seu personagem girando no ar
//
//	Bugs:
//	Nao ha nenhum bug detectado
//==================================================================//

enum Axes {MouseXandY, MouseX, MouseY}
var Axis : Axes = Axes.MouseXandY;
 
var sensitivityX = 15.0;
var sensitivityY = 15.0;
 
var minimumX = -360.0;
var maximumX = 360.0;
 
var minimumY = -60.0;
var maximumY = 60.0;

var rotationX = 0.0;
var rotationY = 0.0;

var lookSpeed = 2.0;
 
function Update ()
{
	if (Axis == Axes.MouseXandY)
	{
		rotationX += Input.GetAxis("Mouse X") * sensitivityX;
		rotationY += Input.GetAxis("Mouse Y") * sensitivityY;

		Adjust360andClamp();
		transform.localRotation = Quaternion.AngleAxis (rotationX, Vector3.up);
		transform.localRotation *= Quaternion.AngleAxis (rotationY, Vector3.left);
	}
	else if (Axis == Axes.MouseX)
	{
		rotationX += Input.GetAxis("Mouse X") * sensitivityX;
		Adjust360andClamp();
		transform.localRotation = Quaternion.AngleAxis (rotationX, Vector3.up);
	}
	else
	{
		rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
		Adjust360andClamp();
		transform.localRotation = Quaternion.AngleAxis (rotationY, Vector3.left);
	}
}
 
function Adjust360andClamp ()
{
	if (rotationX < -360)
	{
		rotationX += 360;
	}
	else if (rotationX > 360)
	{
		rotationX -= 360;
	}   

	if (rotationY < -360)
	{
		rotationY += 360;
	}
	else if (rotationY > 360)
	{
	rotationY -= 360;
	}
	rotationX = Mathf.Clamp (rotationX, minimumX, maximumX);
	rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
}
 
function Start ()
{
	if (GetComponent.<Rigidbody>())
	{
		GetComponent.<Rigidbody>().freezeRotation = true;
	}
}

function OnControllerColliderHit(hit : ControllerColliderHit){
	if(hit.gameObject.tag == "Ground"){
		Spawner.setPlayerOn(hit.gameObject.GetComponent(Spawner).groundN);
	}
}