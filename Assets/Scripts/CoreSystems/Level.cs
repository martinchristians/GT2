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
    [SerializeField] float m_maxTimeGain;
    [SerializeField] float m_minTimeGain;
    [SerializeField] int m_stepsFromMaxToMinTimeGain;
    [SerializeField] float m_goldDist;
    [SerializeField] float m_silverDist;
    [SerializeField] float m_bronzeDist;

    float m_startTime;
    int m_currentCoinsCollected;
    int m_checkpointsPassed;
    float m_initZ;

    public event System.Action onCoinCollected = delegate {};
    public event System.Action onCheckpointPassed = delegate {};

    public float playTime => Time.time - m_startTime;
    public float remainingTime { get; private set; }
    public int currentCoinsCollected => m_currentCoinsCollected;
    public float distanceTraveled => (m_mode != Mode.GoFarWithCheckpoints ? float.NaN : Mathf.Max(0, CarController.current.position.z - m_initZ));
    public Mode mode => m_mode;

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

    void Start () {
        if(m_mode == Mode.GoFarWithCheckpoints && CoreSystems.CarSpawn.current != null){
            m_initZ = CoreSystems.CarSpawn.current.transform.position.z;
        }
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
        onCoinCollected();
    }

    public void CheckpointPassed () {
        var timeGain = Mathf.Lerp(m_maxTimeGain, m_minTimeGain, Mathf.Clamp01((float)m_checkpointsPassed / m_stepsFromMaxToMinTimeGain));
        remainingTime += timeGain;
        m_checkpointsPassed++;
        onCheckpointPassed();
    }

    public void StartTimer () {
        m_startTime = Time.time;
    }

    public string GetInfoAsString () {
        switch(m_mode){
            case Mode.FreePlay:
                return "Free Play!";
            case Mode.GoFarWithCheckpoints:
                return
                    $"Gold: {m_goldDist:F0}m\n"+
                    $"Silver: {m_silverDist:F0}m\n"+
                    $"Bronze: {m_bronzeDist:F0}m";
            case Mode.GoFastWithTimeLimits:
                return
                    $"Gold: {m_goldTime:F1}s\n"+
                    $"Silver: {m_silverTime:F1}sW\n"+
                    $"Bronze: {m_bronzeTime:F1}s";
            default:
                return "???";
        }
    }

    public SaveData GetSaveData () {
        return new SaveData(){
            levelName = this.gameObject.scene.name,
            levelMode = this.m_mode,
            playDuration = playTime,
            distanceCovered = distanceTraveled,
            coinsCollected = m_currentCoinsCollected,
            starRating = CalculateRating()
        };

        int CalculateRating () {
            switch(m_mode){
                case Mode.FreePlay:
                    return 0;
                case Mode.GoFarWithCheckpoints:
                    if(distanceTraveled >= m_goldDist) return 3;
                    if(distanceTraveled >= m_silverDist) return 2;
                    if(distanceTraveled >= m_bronzeDist) return 1;
                    return 0;
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
