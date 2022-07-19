using KenCars;
using System.Collections;
using UnityEngine;

public class ObjSticksToCar : MonoBehaviour
{
    private GameObject collidedObject = null;
    private bool collided = false;
    private Vector3 offset;


    // Update is called once per frame
    private void Update()
    {
        if(collided && collidedObject != null)
        {
            Quaternion carRot = collidedObject.transform.rotation;
            carRot *= Quaternion.Euler(0, 0, 30);
            transform.position = collidedObject.transform.position + offset;
            transform.rotation = carRot;
            collidedObject.GetComponent<Vehicle>().throttled = true;
            StartCoroutine(Drop());
        }
    }

    IEnumerator Drop()
    {
        yield return new WaitForSeconds(4f);
        collidedObject.GetComponent<Vehicle>().throttled = false;
        collided = false;
        this.GetComponent<ObjSticksToCar>().enabled = false;
        this.GetComponent<ObjSticksToCar>().enabled = true;
    }

    private void OnTriggerEnter(Collider other)
    {
        float valInRange = Random.Range(-0.5f, 0.5f);
        if (valInRange >= 0 && valInRange >= 0.3)
        {
            valInRange = +0.3f; //TODO: hier nochmal checken
        }
        else if (valInRange <= 0 && valInRange >= -0.3)
        {
            valInRange = -0.3f; //TODO: hier nochmal checken
        }
        Debug.Log("value: " + valInRange);
        offset = new Vector3(valInRange, 0, 0);

        if (other.gameObject.name == "vehicle")
        {
            collided = true;
            collidedObject = other.gameObject;
        }
    }

    public bool GetCollided()
    {
        return this.collided;
    }
}
