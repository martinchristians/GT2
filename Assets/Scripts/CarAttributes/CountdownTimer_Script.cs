using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class CountdownTimer_Script : MonoBehaviour
{
    public float startingTime = 120.0f;
    private float currentTime;
    [SerializeField] private TextMeshProUGUI countDownText;

    public CarController_Script CarControllerScript;
    
    private void Start()
    {
        currentTime = startingTime;
    }

    private void Update()
    {
        if (currentTime > 0)
        {
            currentTime -= 1 * Time.deltaTime;
            countDownText.text = "Timer: " + currentTime.ToString("0.00");
        }
        else
        {
            CarControllerScript.gameObject.SetActive(false);
        }
    }
}
