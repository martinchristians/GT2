using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CarController_Script: MonoBehaviour
{
    public int maxHealth = 3;
    public int currentHealth;
    private int shieldNumber = 2;
    
    public HealthBar_Script HealthBarScript;
    public GameObject shields;
    [SerializeField] private bool shields_b;

    private void Start()
    {
        currentHealth = maxHealth;
        HealthBarScript.SetMaxHealth(maxHealth);
        shields_b = false;
    }

    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.tag == "Damage Wall")
        {
            Debug.Log("COLLIDE DAMAGE WALL");

            if (shields_b == true)
            {
                shields.transform.GetChild(shieldNumber).gameObject.GetComponent<Image>().enabled = false;
                shieldNumber -= 1;

                if (shieldNumber == -1)
                {
                    shields_b = false;
                }
            }
            else
            {
                TakeDamage(1);

                if (HealthBarScript.slider.value == 0)
                {
                    // destroy spawn car
                    //Destroy(transform.parent.gameObject);
                    
                    // hide vehicle
                    transform.parent.gameObject.transform.GetChild(1).gameObject.SetActive(false);
                }
            }
        }
    }

    private void OnTriggerEnter(Collider collision)
    {
        if (collision.gameObject.name == "Shield")
        {
            Debug.Log("PROTECTION");
            
            shields_b = true;
            for (int i = 0; i < 3; i++)
            {
                shields.transform.GetChild(i).gameObject.GetComponent<Image>().enabled = true;
            }
            Destroy(collision.gameObject);
        }
    }

    void TakeDamage(int damage)
    {
        currentHealth -= damage;
        HealthBarScript.SetHealth(currentHealth);
    }
}
