using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CollectCoin : MonoBehaviour
{
    private AudioSource coinFX;
    private Point_Script points;

    public void Collect()
    {
        Debug.Log("called collect");
        coinFX = GameObject.FindGameObjectWithTag("AudioSource").GetComponent<AudioSource>();
        coinFX.Play();
    }
}
