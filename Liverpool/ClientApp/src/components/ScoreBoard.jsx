import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';

function ScoreBoard({ playersRanked }) {
    const prevPointsRef = useRef({});
    const [changedPlayers, setChangedPlayers] = useState({});

    useEffect(() => {
        const changed = {};
        playersRanked.forEach(p => {
            if (prevPointsRef.current[p.name] !== undefined &&
                prevPointsRef.current[p.name] !== p.points) {
                changed[p.name] = true;
            }
            prevPointsRef.current[p.name] = p.points;
        });
        if (Object.keys(changed).length > 0) {
            setChangedPlayers(changed);
            setTimeout(() => setChangedPlayers({}), 600);
        }
    }, [playersRanked]);

    return (
        <table style={{
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            fontFamily: "'Lato', sans-serif",
            minWidth: 120,
            flexShrink: 0,
        }}>
            <thead>
                <tr>
                    <th style={{ color: 'var(--gold-400)', padding: '4px 10px', borderBottom: '1px solid rgba(212,168,67,0.3)', textAlign: 'left' }}>
                        <FormattedMessage id="game.name" />
                    </th>
                    <th style={{ color: 'var(--gold-400)', padding: '4px 10px', borderBottom: '1px solid rgba(212,168,67,0.3)', textAlign: 'right' }}>
                        <FormattedMessage id="game.points" />
                    </th>
                </tr>
            </thead>
            <tbody>
                {playersRanked.map((player) => (
                    <tr key={player.name + 'Ranked'}>
                        <td style={{ padding: '4px 10px', color: 'var(--text-muted)' }}>{player.name}</td>
                        <motion.td
                            animate={changedPlayers[player.name]
                                ? { scale: [1, 1.4, 1], color: ['var(--gold-400)', 'var(--text-primary)'] }
                                : {}}
                            transition={{ duration: 0.5 }}
                            style={{ padding: '4px 10px', textAlign: 'right', fontWeight: 700 }}
                        >
                            {player.points}
                        </motion.td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ScoreBoard;
