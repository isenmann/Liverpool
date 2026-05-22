import React from 'react';
import styles from './FeltTable.module.css';

function FeltTable({ leftPlayer, topPlayer, rightPlayer, centerTop, centerMid, centerBottom }) {
    return (
        <div className={styles.tableWrapper}>
            <div className={styles.railTop} />

            <div className={styles.leftZone}>
                {leftPlayer}
            </div>

            <div className={styles.center}>
                <div className={styles.topArea}>
                    {topPlayer}
                </div>
                <div className={styles.midArea}>
                    {centerMid}
                </div>
                <div className={styles.bottomArea}>
                    {centerBottom}
                </div>
            </div>

            {rightPlayer
                ? <div className={styles.rightZone}>{rightPlayer}</div>
                : <div className={styles.rightZoneEmpty} />
            }

            <div className={styles.railBottom} />
        </div>
    );
}

export default FeltTable;
