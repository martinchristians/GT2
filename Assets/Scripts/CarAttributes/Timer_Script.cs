using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class Timer_Script : MonoBehaviour
{
    private float startingTime;
    private float currentTime;
    [SerializeField] private TextMeshProUGUI timerText;

    public CarController_Script CarControllerScript;
    
    private void Start()
    {
        currentTime = startingTime;
    }

    private void Update()
    {
        if (CarControllerScript.currentHealth == 0)
        {
            timerText.text = "Timer: " + currentTime.ToString("0.00");
        }
        else
        {
            currentTime += 1 * Time.deltaTime;
            timerText.text = "Timer: " + currentTime.ToString("0.00");
        }
    }
}
