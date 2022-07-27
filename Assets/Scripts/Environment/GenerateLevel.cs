using System.Collections.Generic;
using UnityEngine;

public class GenerateLevel : MonoBehaviour {

    const float SECTION_LENGTH = 50;
    const int GENERATED_SECTION_BUFFER_SIZE = 10;

    [SerializeField] GameObject[] m_groundVariations;
    [SerializeField] GameObject[] m_roadVariations;

    Queue<GameObject> spawnedSections;

    float nextSectionZ;

    void Start () {
        foreach(var obj in m_groundVariations) obj.SetActive(false);
        foreach(var obj in m_roadVariations) obj.SetActive(false);
        spawnedSections = new Queue<GameObject>();
        nextSectionZ = SECTION_LENGTH;
        for(int i=0; i<GENERATED_SECTION_BUFFER_SIZE / 2; i++){
            spawnedSections.Enqueue(GenerateSection());
        }
        Level.current.onCheckpointPassed += () => {
            spawnedSections.Enqueue(GenerateSection());
            while(spawnedSections.Count > GENERATED_SECTION_BUFFER_SIZE){
                Destroy(spawnedSections.Dequeue());
            }
        };
    }

    GameObject GenerateSection () {
        var ground = Instantiate(m_groundVariations[Random.Range(0, m_groundVariations.Length)]);
        ground.SetActive(true);
        if(Random.value > 0.5f) MirrorX(ground.transform.Find("Buildings"));
        var road = Instantiate(m_roadVariations[Random.Range(0, m_roadVariations.Length)]);
        road.SetActive(true);
        road.transform.SetParent(ground.transform, false);
        road.transform.localPosition = Vector3.zero;
        ground.transform.position = new Vector3(0, 0, nextSectionZ);
        nextSectionZ += SECTION_LENGTH;
        return ground;
    }

    static void MirrorX (Transform transform) {
        transform.localScale = Vector3.Scale(transform.localScale, new Vector3(-1, 1, 1));
    }

    static void MirrorZ (Transform transform) {
        transform.localScale = Vector3.Scale(transform.localScale, new Vector3(1, 1, -1));
    }

}
