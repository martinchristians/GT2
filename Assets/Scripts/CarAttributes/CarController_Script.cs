using System;
using System.Collections;
using System.Collections.Generic;
using KenCars;
using TMPro;
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

    public Vehicle VehicleScript;
    public Animator anim;

    public ShowMedal ShowMedal;
    
    private void Start()
    {
        currentHealth = maxHealth;
        HealthBarScript.SetMaxHealth(maxHealth);
        shields_b = false;
    }

    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.name != "Ground")
        {
            Debug.Log("COLLIDE");
            // if user has shield, then get neither damage nor disadvantage effect 
            if (shields_b == true)
            {
                CallMedal();
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
                    // destroy spawn vehicle
                    //Destroy(transform.parent.gameObject);
                    
                    // hide vehicle
                    transform.parent.gameObject.transform.GetChild(1).gameObject.SetActive(false);
                }
                else
                {
                    CallMedal();
                    
                    if (collision.gameObject.tag == "Damage Wall")
                    {
                        Debug.Log("Collide with normal wall");
                    }
                    else if (collision.gameObject.tag == "BigSmall Wall")
                    {
                        Debug.Log("Collide with BigSmall wall");
                        SetUpZPosition();
                        anim.Play("BigSmall");
                    }
                    else if (collision.gameObject.tag == "Cone")
                    {
                        Debug.Log("Collide with Road Cone");
                        Destroy(collision.gameObject);
                    }
                }
            }
        }
    }

    private void OnTriggerEnter(Collider collision)
    {
        if (collision.gameObject.name == "Shield")
        {
            Debug.Log("shield active");
            
            shields_b = true;
            for (int i = 0; i < 3; i++)
            {
                shields.transform.GetChild(i).gameObject.GetComponent<Image>().enabled = true;
            }
            Destroy(collision.gameObject);
        } else if (collision.gameObject.name == "Health")
        {
            Debug.Log("collide health");
            
            if (currentHealth < 3)
            {
                Debug.Log("add one life");
                HealthBarScript.slider.value += 1;
                currentHealth += 1;
                Destroy(collision.gameObject);
            }
        } else if (collision.gameObject.name == "SpeedPad")
        {
            Debug.Log("accelerate");
            VehicleScript.sphere.velocity = Vector3.forward * 25;
        }
    }

    void TakeDamage(int damage)
    {
        currentHealth -= damage;
        HealthBarScript.SetHealth(currentHealth);
    }

    void SetUpZPosition()
    {
        Vector3 pos = gameObject.transform.position;
        for (int i = 1; i < 4; i++)
        {
            transform.parent.gameObject.transform.GetChild(i).gameObject.transform.position =
                pos + new Vector3(0, 0, -1);
        }
    }

    void CallMedal()
    {
        ShowMedal.CallMedal();
        ShowMedal.medalObj.GetComponent<Image>().sprite = ShowMedal.spriteMedal;
        ShowMedal.medalObj.GetComponent<Image>().enabled = true;
                    
        ShowMedal.medalObj.transform.GetChild(0).gameObject.GetComponent<TextMeshProUGUI>().text = ShowMedal.quote;
        ShowMedal.medalObj.transform.GetChild(0).gameObject.GetComponent<TextMeshProUGUI>().enabled = true;
        
        StartCoroutine(SetInactive());
    }

    IEnumerator SetInactive()
    {
        yield return new WaitForSeconds(4f);
        ShowMedal.medalObj.GetComponent<Image>().enabled = false;
        ShowMedal.medalObj.transform.GetChild(0).gameObject.GetComponent<TextMeshProUGUI>().enabled = false;
    }
}
