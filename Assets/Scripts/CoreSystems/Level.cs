using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Level : MonoBehaviour {

    public enum Mode {
        FreePlay = 0,
        GoFastWithTimeLimits = 10,
        GoFarWithCheckpoints = 20,
    }

    public static Level current { get; private set; }

    [field: SerializeField] public float killPlaneY;
    [SerializeField] Mode m_mode;

    float m_startTime;

    public float playTime => Time.time - m_startTime;

    void Awake () {
        current = this;
        m_startTime = float.NaN;
    }

    public void StartTimer () {
        m_startTime = Time.time;
    }

    public SaveData GetSaveData () {
        return new SaveData(){
            levelName = this.gameObject.scene.name,
            levelMode = this.m_mode,
            playDuration = System.TimeSpan.FromSeconds(playTime),
            distanceCovered = float.NaN,    // TODO
            coinsCollected = -1,            // TODO
            starRating = CalculateRating()
        };

        int CalculateRating () {
            // TODO
            return 0;
        }
    }

    [System.Serializable]
    public struct SaveData {

        [SerializeField] public string levelName;
        [SerializeField] public Mode levelMode;
        [SerializeField] public System.TimeSpan playDuration;
        [SerializeField] public float distanceCovered;
        [SerializeField] public int coinsCollected;
        [SerializeField] public int starRating;

    }

}
