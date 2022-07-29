using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class TutorialArena : MonoBehaviour
{
    private GameObject vehicle;

    public GameObject panel;
    private int countParkingSlot = 3;
    public Animator anim;

    private void Start()
    {
        vehicle = GameObject.Find("sphere");
        anim.Play("panel");
    }

    void Update()
    {
        if (vehicle.GetComponent<CarController>().triggerStay)
        {
            countParkingSlot -= 1;
            vehicle.GetComponent<CarController>().triggerStay = false;
            if (countParkingSlot == 2)
            {
                panel.transform.GetChild(0).GetComponent<TextMeshProUGUI>().text = "Good job! 1 is out, only 2 more left";
                anim.Play("panel");
            } else if (countParkingSlot == 0)
            {
                panel.transform.GetChild(0).GetComponent<TextMeshProUGUI>().text = "Well done! Now lets go to the real challenge";
                anim.Play("panel");
                gameObject.GetComponent<Animator>().Play("openDoor");
            }
        }
    }
}
