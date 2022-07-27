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

    [SerializeField] float m_killPlaneY = -5;
    [SerializeField] Mode m_mode;
    [SerializeField] float m_goldTime;
    [SerializeField] float m_silverTime;
    [SerializeField] float m_bronzeTime;
    [SerializeField] float m_initTimeLimit;
    [SerializeField] float m_goldDist;
    [SerializeField] float m_silverDist;
    [SerializeField] float m_bronzeDist;

    float m_startTime;
    int m_currentCoinsCollected;

    public float playTime => Time.time - m_startTime;
    public float remainingTime { get; private set; }

    public float displayTime { get {
        switch(m_mode){
            case Mode.FreePlay:
            case Mode.GoFastWithTimeLimits:
            default:
                return float.IsNaN(playTime) ? 0f : Mathf.Max(0, playTime);
            case Mode.GoFarWithCheckpoints:
                return Mathf.Max(0, remainingTime);
        }
    } }

    void Awake () {
        current = this;
        m_startTime = float.NaN;
        remainingTime = m_initTimeLimit;
    }

    void Update () {
        if(m_mode == Mode.GoFarWithCheckpoints && !float.IsNaN(m_startTime) && Time.time > m_startTime && remainingTime >= 0){
            remainingTime -= Time.deltaTime;
            if(remainingTime < 0){
                CarController.current.Kill();
            }
        }
    }

    void FixedUpdate () {
        if(CarController.current != null){
            if(CarController.current.position.y < m_killPlaneY){
                CarController.current.Kill();
            }
        }
    }

    public void CoinCollected () {
        m_currentCoinsCollected++;
    }

    public void StartTimer () {
        m_startTime = Time.time;
    }

    public SaveData GetSaveData () {
        return new SaveData(){
            levelName = this.gameObject.scene.name,
            levelMode = this.m_mode,
            playDuration = playTime,
            distanceCovered = float.NaN,    // TODO
            coinsCollected = m_currentCoinsCollected,
            starRating = CalculateRating()
        };

        int CalculateRating () {
            switch(m_mode){
                case Mode.FreePlay:
                    return 0;
                case Mode.GoFarWithCheckpoints:
                    // TODO
                case Mode.GoFastWithTimeLimits:
                    if(playTime <= m_goldTime) return 3;
                    if(playTime <= m_silverTime) return 2;
                    if(playTime <= m_bronzeTime) return 1;
                    return 0;
                default:
                    return 0;
            }
        }
    }

    [System.Serializable]
    public struct SaveData {

        [SerializeField] public string levelName;
        [SerializeField] public Mode levelMode;
        [SerializeField] public float playDuration;
        [SerializeField] public float distanceCovered;
        [SerializeField] public int coinsCollected;
        [SerializeField] public int starRating;

        public bool IsBetterThan (SaveData other) {
            if(other.levelName != this.levelName){
                return false;
            }
            switch(levelMode){
                case Level.Mode.FreePlay:
                    return false;
                case Level.Mode.GoFarWithCheckpoints:
                    return this.distanceCovered > other.distanceCovered;
                case Level.Mode.GoFastWithTimeLimits:
                    return this.playDuration < other.playDuration;
            }
            return false;
        }
    }

}
