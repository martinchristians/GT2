using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CarController_Script: MonoBehaviour
{
    public int maxHealth = 3;
    public int currentHealth;
    public HealthBar_Script HealthBarScript;

    private void Start()
    {
        currentHealth = maxHealth;
        HealthBarScript.SetMaxHealth(maxHealth);
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            TakeDamage(1);
        }
    }

    void TakeDamage(int damage)
    {
        currentHealth -= damage;
        HealthBarScript.SetHealth(currentHealth);
    }
}
