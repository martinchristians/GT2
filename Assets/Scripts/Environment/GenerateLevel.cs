using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GenerateLevel : MonoBehaviour
{
    public GameObject[] sections;
    static Queue<GameObject> sectionQueue;
    public int zPos = 50;

    public bool creatingSection = false;
    public int distance;
    public bool addingDis = false;
    float current_car_zPos;
    static float next_car_zPos;

    void Start()
    {
        if (current_car_zPos == null)
        {
            current_car_zPos = GameObject.Find("vehicleCar(Clone)/vehicle").transform.localPosition.z;
        }
        next_car_zPos = current_car_zPos + 1;
        sectionQueue = new Queue<GameObject>();
    }

    // Update is called once per frame
    void Update()
    {
        if (!creatingSection)
        {
            creatingSection = true;
            GenerateSection();
        }
        // current_car_zPos = GameObject.Find("vehicleCar(Clone)/vehicle").transform.localPosition.z;
        current_car_zPos = CarController.current.position.z;
        // increment distance if car has moved forward
        if (current_car_zPos >= next_car_zPos)
        {
            next_car_zPos = current_car_zPos + 25;
            distance += 25;
            creatingSection = false;
            // debug distance
            Debug.Log($"distance: {distance}");
        }
        if (sectionQueue.Count >= 50)
        {
            GameObject section = sectionQueue.Dequeue();
            Destroy(section);
        }
    }

    public void GenerateSection()
    {
        int random = Random.Range(0, sections.Length);
        GameObject section = sections[random];
        sectionQueue.Enqueue(Instantiate(section, new Vector3(0, 0, zPos), Quaternion.identity));
        zPos += 50;
        //yield return new WaitForSeconds(2);
        //creatingSection = false;
    }
}
